from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import torch
import io
import cv2
import numpy as np

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and processor
processor = TrOCRProcessor.from_pretrained('microsoft/trocr-base-handwritten')
model = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-base-handwritten')
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

def preprocess_lines(image_pil):
    """Splits the image into lines using OpenCV and returns list of line images."""
    image_np = np.array(image_pil)
    gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
    _, thresh = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY_INV)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (image_np.shape[1]//2, 5))
    dilated = cv2.dilate(thresh, kernel, iterations=1)

    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    lines = []
    for cnt in sorted(contours, key=lambda c: cv2.boundingRect(c)[1]):
        x, y, w, h = cv2.boundingRect(cnt)
        line_img = image_np[y:y+h, x:x+w]
        line_pil = Image.fromarray(line_img)
        lines.append(line_pil)
    return lines

@app.post("/api/translate")
async def translate(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

       
        lines = preprocess_lines(image)
        translated_lines = []

        for line in lines:
            pixel_values = processor(images=line, return_tensors="pt").pixel_values.to(device)
            generated_ids = model.generate(pixel_values)
            text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            translated_lines.append(text)

        final_text = "\n".join(translated_lines)
        return {"text": final_text}

    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "Translator API running with OpenCV"}
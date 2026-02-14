import React, { useState } from 'react';
import './translator.css';

const Translator = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [timeTaken, setTimeTaken] = useState(null); // ⏱️ Time state

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult('');
      setTimeTaken(null); // reset time when new image is selected
    }
  };

  const handleTranslate = async () => {
    if (!image) return;
    setLoading(true);
    setTimeTaken(null);

    const formData = new FormData();
    formData.append('file', image); // Must match FastAPI param name

    const startTime = Date.now(); // Start timing

    try {
      const response = await fetch('http://127.0.0.1:8000/api/translate', {
        method: 'POST',
        body: formData,
      });

      const endTime = Date.now(); // End timing
      const duration = ((endTime - startTime) / 1000).toFixed(2); // seconds

      const data = await response.json();

      if (response.ok) {
        setResult(data.text);
        setTimeTaken(duration);
      } else {
        setResult(data.error || 'Translation failed.');
      }
    } catch (err) {
      console.error(err);
      setResult('Error occurred while processing the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trans">
      <h2>HANDWRITTEN TEXT RECOGNITION</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="upload-btn"
        disabled={loading}
      />

      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" />
        </div>
      )}

      <button onClick={handleTranslate} disabled={loading} className="translate-btn">
        {loading ? 'Translating...' : 'Translate'}
      </button>

      {result && (
        <div className="output">
          <h3>Translated Text:</h3>
          <textarea
            value={result}
            onChange={(e) => setResult(e.target.value)}
            rows={6}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              resize: 'vertical',
            }}
          />
        </div>
      )}

      {timeTaken && (
        <div style={{ marginTop: '10px', color: 'lightgreen', fontWeight: 'bold' }}>
          ⏱️ Translation Time: {timeTaken} seconds
        </div>
      )}
    </div>
  );
};

export default Translator;
 
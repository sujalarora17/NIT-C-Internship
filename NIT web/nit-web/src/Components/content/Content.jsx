import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' 
import './content.css'

const Content = () => {
  const [cls, setcls] = useState("trynow")
  const nav = useNavigate()

  return (
    <div className='content'>
      <div className='contenth3'>
        <h3>YOUR AI-POWERED HANDWRITTEN</h3>
        <h3>TEXT RECOGNITION</h3>
      </div>

      <div className='tagline'>
        <p>Empowering digital transformation by converting handwritten text into searchable, editable,</p>
        <p>and accessible content using advanced AI technology.</p>
      </div>

      <div className="tryon">
        <button
          className={cls === "trynow" ? "trynow" : "coma"}
          onClick={() => {
            setcls("trynow")
            nav('/translator') 
          }}
        >
          Try now
        </button>

        <button
          className={cls === "moreinfo" ? "trynow" : "coma"}
          onClick={() => {
            setcls("moreinfo")
          
          }}
        >
          More info
        </button>
      </div>
    </div>
  )
}

export default Content

import React from 'react';
import './index.css'; // Import CSS file for SpeechArea

const SpeechArea = ({ content, onTextareaChange }) => {
  return (
    <textarea className="textarea" value={content} onChange={onTextareaChange}></textarea> 
  );
}

export default SpeechArea;

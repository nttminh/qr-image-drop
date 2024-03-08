// Upload.js
import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function getFileType(filename) {
  const lastIndex = filename.lastIndexOf('.');
  if (lastIndex !== -1) {
    return filename.slice(lastIndex + 1).toLowerCase();
  }
  return null; // or an empty string, depending on your preference
}

function Upload() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (getFileType(file.name) === "jpg") {
      socket.emit('uploadImage', ["p", file.name])
      return;
    }
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      socket.emit('uploadImage', [reader.result, file.name]);
    };
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <input type="file" onChange={handleImageUpload} />
      {selectedImage && <img src={selectedImage} alt="Uploaded" />}
    </div>
  );
}

export default Upload;

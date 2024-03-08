// Upload.js
import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Upload() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (file.name.toLowerCase().endsWith('heic')) {
        console.log(reader.result)
        socket.emit('uploadHEIC', reader.result);
      } else {
        socket.emit('uploadImage', reader.result);
        setSelectedImage(reader.result);
      }
    };
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {selectedImage && <img src={selectedImage} alt="Uploaded" />}
    </div>
  );
}

export default Upload;

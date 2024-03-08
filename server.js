// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const heicConvert = require('heic-convert');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('uploadImage', async (data) => {

    console.log(data[1])
    const imgData = data[0];
    const filename = data[1].toLowerCase();
    const fileType = getFileType(filename);

    // if (!(["jpg", "jpeg", "png"].includes(fileType))) {
    if (true) {
      // const imgBuffer = Buffer.from(new Uint8Array(dataURItoBlob(imgData)));
      fs.writeFileSync(`./temp/${filename}`, imgData);
      // await writeFileFromDataURI(imgData, `./temp/${filename}`)
      console.log(imgData.slice(0, 100))

    } else {
      io.emit('newImage', imgData);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// helper

function getFileType(filename) {
  const lastIndex = filename.lastIndexOf('.');
  if (lastIndex !== -1) {
    return filename.slice(lastIndex + 1).toLowerCase();
  }
  return null; // or an empty string, depending on your preference
}

import base64
from flask import Flask, request
from flask_socketio import SocketIO, emit
from binascii import a2b_base64
from base64 import b64encode
from uuid import uuid4
from heic2png import HEIC2PNG
from PIL import Image
from io import BytesIO


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

PORT = 5000

@app.post('/uploadHEIC')
def handle_heic():
    id = uuid4()
    heic_filename = f'{id}.heic'
    heic_file = request.files['file']
    heic_filepath = f'./temp/{heic_filename}'
    if (heic_file):
        heic_file.save(heic_filepath)
    else:
        return {'status': 'error'}
    heic_img = HEIC2PNG(heic_filepath, quality=90)
    png_path = heic_img.save()
    png_img = Image.open(png_path)
    width, height = png_img.size
    new_size = (width//25, height//25)
    resized_img = png_img.resize(new_size)
    buffered = BytesIO()
    resized_img.save(buffered, format="PNG")
    png_encoded = b64encode(buffered.getvalue())

    socketio.emit('newConvertedImage', png_encoded)
    return {'status': 'success'}

@socketio.on('uploadImage')
def handle_message(data):
    print('Message:', data)
    emit('newImage', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=PORT)

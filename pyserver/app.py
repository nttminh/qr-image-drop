from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

PORT = 5000

@socketio.on('uploadImage')
def handle_message(data):
    print('Message:', data)
    emit('newImage', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=PORT)

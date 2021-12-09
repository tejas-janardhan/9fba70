async_mode = None

import os

import socketio
from online_users import online_users

basedir = os.path.dirname(os.path.realpath(__file__))
sio = socketio.Server(async_mode=async_mode, logger=False, cors_allowed_origins=[])
thread = None


@sio.event
def connect(sid, environ):
    sio.emit("my_response", {"data": "Connected", "count": 0}, room=sid)


@sio.on("go-online")
def go_online(sid, user_id):
    if user_id not in online_users:
        online_users.append(user_id)
    sio.emit("add-online-user", user_id, skip_sid=sid)


@sio.on("new-message")
def new_message(sid, message):
    sio.emit(
        "new-message",
        {"message": message["message"], "sender": message["sender"], "isNewConversation": message["isNewConversation"]},
        skip_sid=sid,
    )


@sio.on("conversation-read")
def read_message(sid, last_read_message_other_user):
    sio.emit("conversation-read",
             {"lastReadMessageOtherUser": last_read_message_other_user},
             skip_sid=sid
             )


@sio.on("logout")
def logout(sid, user_id):
    if user_id in online_users:
        online_users.remove(user_id)
    sio.emit("remove-offline-user", user_id, skip_sid=sid)

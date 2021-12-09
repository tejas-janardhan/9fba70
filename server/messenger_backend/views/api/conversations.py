from django.contrib.auth.middleware import get_user
from django.db.models import Q
from django.db.models.query import Prefetch
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Conversation, Message
from online_users import online_users
from rest_framework.views import APIView
from rest_framework.request import Request


class Conversations(APIView):
    """get all conversations for a user, include latest message text for preview, and all messages
    include other user model so we have info on username/profile pic (don't include current user info)
    TODO: for scalability, implement lazy loading,"""

    def put(self, request: Request):
        if request.user.is_anonymous:
            return HttpResponse(status=401)

        conversation_id = request.data.get("conversationId")

        conversation = Conversation.objects.prefetch_related(
            Prefetch("messages", queryset=Message.objects.order_by("createdAt"))
        ).get(id=conversation_id)

        last_read_message = conversation.set_latest_read_message(request.user.id)  # Sets and returns the message too.

        response_dict = {
            "lastReadMessageOtherUser": Message.get_none_or_dict(last_read_message)
        }

        return JsonResponse(response_dict)

    def get(self, request: Request):
        user = get_user(request)

        if user.is_anonymous:
            return HttpResponse(status=401)
        user_id = user.id

        conversations = (
            Conversation.objects.filter(Q(user1=user_id) | Q(user2=user_id))
                .prefetch_related(
                Prefetch("messages", queryset=Message.objects.order_by("createdAt"))
            )
                .all()
        )

        conversations_response = []

        message_fields = ["id", "text", "senderId", "createdAt"]

        for convo in conversations:
            convo_dict = {
                "id": convo.id,
                "messages": [
                    message.to_dict(message_fields) for message in convo.messages.all()
                ],
            }

            # set properties for notification count and latest message preview
            convo_dict["latestMessageText"] = convo_dict["messages"][-1]["text"]

            # set a property "otherUser" so that frontend will have easier access
            user_fields = ["id", "username", "photoUrl"]

            last_read_message = None
            if convo.user1 and convo.user1.id != user_id:
                convo_dict["otherUser"] = convo.user1.to_dict(user_fields)
                convo_dict["lastReadMessageOtherUser"] = Message.get_none_or_dict(
                    convo.last_read_message_user1, message_fields
                )
                last_read_message = convo.last_read_message_user2
            elif convo.user2 and convo.user2.id != user_id:
                convo_dict["otherUser"] = convo.user2.to_dict(user_fields)
                convo_dict["lastReadMessageOtherUser"] = Message.get_none_or_dict(
                    convo.last_read_message_user2, message_fields
                )
                last_read_message = convo.last_read_message_user1

            # set property for online status of the other user
            if convo_dict["otherUser"]["id"] in online_users:
                convo_dict["otherUser"]["online"] = True
            else:
                convo_dict["otherUser"]["online"] = False

            convo_dict["unreadMessageCount"] = Conversation.get_unread_message_count(
                convo_dict["messages"], last_read_message, convo_dict["otherUser"]["id"]
            )

            conversations_response.append(convo_dict)

        conversations_response.sort(
            key=lambda convo: convo["messages"][-1]["createdAt"],
            reverse=True,
        )
        return JsonResponse(
            conversations_response,
            safe=False,
        )

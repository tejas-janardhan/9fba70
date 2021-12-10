from django.db import models
from typing import List
from . import utils
from .conversation import Conversation, GroupConversation


class BaseMessage(utils.CustomModel):
    text = models.TextField(null=False)
    senderId = models.IntegerField(null=False)

    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Message(BaseMessage):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        db_column="conversationId",
        related_name="messages",
        related_query_name="message",
    )

    @staticmethod
    def get_none_or_dict(message, message_fields: List[str] = None):
        return message.to_dict(message_fields) if message is not None else None


class GroupMessage(BaseMessage):
    conversation = models.ForeignKey(
        GroupConversation,
        on_delete=models.CASCADE,
        db_column="conversationId",
        related_name="messages",
        related_query_name="message",
    )

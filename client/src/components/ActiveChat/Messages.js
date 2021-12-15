import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  let hasIsLastReached = false; // mutable value needed.
  const getIsLastRead = (message, index, messages) => {
    if (message.senderId === userId) {
      const nextMessage = messages
        .slice(index + 1)
        .find((message) => message.senderId === userId);
      if (nextMessage) {
        return message.read !== nextMessage.read;
      } else {
        return message.read;
      }
    } else {
      return false;
    }
  };

  return (
    <Box>
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");

        const isLastRead = hasIsLastReached
          ? false
          : getIsLastRead(message, index, messages);

        hasIsLastReached = isLastRead || hasIsLastReached;

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            isLastRead={isLastRead}
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;

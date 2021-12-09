import React from "react";
import {Avatar, Box} from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";


const Messages = (props) => {
  const { messages, otherUser, userId, lastReadMessageOtherUser } = props

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        return message.senderId === userId ? (
          <SenderBubble key={message.id}
                        text={message.text}
                        time={time}
                        otherUser={otherUser}
                        isLastRead={message.id === (lastReadMessageOtherUser?lastReadMessageOtherUser.id:null)} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;

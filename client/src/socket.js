import io from "socket.io-client";
import store from "./store";
import {
  removeOfflineUser,
  addOnlineUser,
  setUnreadMessageToRead,
} from "./store/conversations";
import { processIncomingMessage } from "./store/utils/thunkCreators";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });
  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", async (data) => {
    store.dispatch(
      processIncomingMessage(
        store.getState().activeConversation,
        data.message,
        data.sender,
        data.isNewConversation
      )
    );
  });
  socket.on("conversation-read", (data) => {
    store.dispatch(
      setUnreadMessageToRead(data.conversationId, store.getState().user.id)
    );
  });
});

export default socket;

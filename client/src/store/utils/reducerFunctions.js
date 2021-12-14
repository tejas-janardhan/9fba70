export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadMessageCount: 1,
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }
  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const resetUnreadMessageCountInStore = (state, conversationId) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };
      convoCopy.unreadMessageCount = 0;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const increaseUnreadMessageCountInStore = (
  state,
  count,
  conversationId
) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };
      convoCopy.unreadMessageCount = convoCopy.unreadMessageCount + count;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const updateReadMessageInStore = (state, conversationId, userId) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages = convoCopy.messages.map((message) => {
        if (message.senderId === userId) {
          const newMessage = { ...message };
          newMessage.read = true;
          return newMessage;
        } else {
          return message;
        }
      });
      return convoCopy;
    } else {
      return convo;
    }
  });
};

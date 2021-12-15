import {
  addNewConvoToStore,
  addOnlineUserToStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
  resetUnreadMessageCountInStore,
  updateReadMessageInStore,
  increaseUnreadMessageCountInStore,
} from "./utils/reducerFunctions";

// ACTIONS

const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";
const RESET_UNREAD_MESSAGE_COUNT = "RESET_UNREAD_MESSAGE_COUNT";
const SET_UNREAD_MESSAGE_TO_READ = "SET_UNREAD_MESSAGE_TO_READ";
const INC_UNREAD_MESSAGE_COUNT = "INC_UNREAD_MESSAGE_COUNT";

// ACTION CREATORS

export const gotConversations = (conversations) => {
  return {
    type: GET_CONVERSATIONS,
    conversations,
  };
};

export const setNewMessage = (message, sender) => {
  return {
    type: SET_MESSAGE,
    payload: { message, sender: sender || null },
  };
};

export const addOnlineUser = (id) => {
  return {
    type: ADD_ONLINE_USER,
    id,
  };
};

export const removeOfflineUser = (id) => {
  return {
    type: REMOVE_OFFLINE_USER,
    id,
  };
};

export const setSearchedUsers = (users) => {
  return {
    type: SET_SEARCHED_USERS,
    users,
  };
};

export const clearSearchedUsers = () => {
  return {
    type: CLEAR_SEARCHED_USERS,
  };
};

// add new conversation when sending a new message
export const addConversation = (recipientId, newMessage) => {
  return {
    type: ADD_CONVERSATION,
    payload: { recipientId, newMessage },
  };
};

export const resetUnreadMessageCount = (conversationId) => {
  return {
    type: RESET_UNREAD_MESSAGE_COUNT,
    conversationId,
  };
};

export const setUnreadMessageToRead = (conversationId, userId) => {
  return {
    type: SET_UNREAD_MESSAGE_TO_READ,
    payload: { conversationId, userId },
  };
};

export const incrementUnreadMessageCount = (conversationId) => {
  return {
    type: INC_UNREAD_MESSAGE_COUNT,
    conversationId,
  };
};

// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return action.conversations;
    case SET_MESSAGE:
      return addMessageToStore(state, action.payload);
    case ADD_ONLINE_USER: {
      return addOnlineUserToStore(state, action.id);
    }
    case REMOVE_OFFLINE_USER: {
      return removeOfflineUserFromStore(state, action.id);
    }
    case SET_SEARCHED_USERS:
      return addSearchedUsersToStore(state, action.users);
    case CLEAR_SEARCHED_USERS:
      return state.filter((convo) => convo.id);
    case ADD_CONVERSATION:
      return addNewConvoToStore(
        state,
        action.payload.recipientId,
        action.payload.newMessage
      );
    case RESET_UNREAD_MESSAGE_COUNT:
      return resetUnreadMessageCountInStore(state, action.conversationId);
    case SET_UNREAD_MESSAGE_TO_READ:
      return updateReadMessageInStore(
        state,
        action.payload.conversationId,
        action.payload.userId
      );
    case INC_UNREAD_MESSAGE_COUNT:
      return increaseUnreadMessageCountInStore(state, 1, action.conversationId);
    default:
      return state;
  }
};

export default reducer;

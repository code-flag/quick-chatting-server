"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConversation = exports.updateChat = exports.createConversation = exports.createChat = exports.getUserChatList = void 0;
const chat_schema_1 = require("../schemas/chat.schema");
const getUserChatList = (userId, roomId, messageObj) => {
    const chatInfo = chat_schema_1.chatRooms.findOne({ $or: [{ userOneId: userId }, { userTwoId: userId }] });
    return chatInfo;
};
exports.getUserChatList = getUserChatList;
const createChat = (userId, roomId, messageObj) => {
    const chatInfo = chat_schema_1.chatRooms.findOne({ $or: [{ userOneId: userId }, { userTwoId: userId }] });
    return chatInfo;
};
exports.createChat = createChat;
const createConversation = (userId, roomId, messageObj) => {
    const chatInfo = chat_schema_1.chatRooms.findOne({ $or: [{ userOneId: userId }, { userTwoId: userId }] });
    return chatInfo;
};
exports.createConversation = createConversation;
const updateChat = (userId, roomId, messageObj) => {
    const chatInfo = chat_schema_1.chatRooms.findOne({ $or: [{ userOneId: userId }, { userTwoId: userId }] });
    return chatInfo;
};
exports.updateChat = updateChat;
const updateConversation = (userId, roomId, messageObj) => {
    const chatInfo = chat_schema_1.chatRooms.findOne({ $or: [{ userOneId: userId }, { userTwoId: userId }] });
    return chatInfo;
};
exports.updateConversation = updateConversation;

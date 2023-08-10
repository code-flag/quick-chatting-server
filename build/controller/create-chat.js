"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
/**
 * This file contain all the methods needs to create a chat for a user
 */
const database_query_1 = require("../model/database/queries/database.query");
const initiate_chat_1 = require("./initiate-chat");
/** get all user chats and subcribes back to all chat chats */
const subscribeUserBackToAllThechats = (userId, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, database_query_1.getUserChats)(userId);
        // console.log("responsesss ", response);
        // console.log('User added back to the following chats:');
        response.map((chat) => {
            socket.join(chat.chatId);
            // console.log("chat - ", chat.chatId);
        });
        return response;
    }
    catch (error) {
        console.log("subscription error", error);
        return false;
    }
});
/**
 *
 * @param {Namespace} chatNsp - resident route namespace
 * @param {*} socket - socket instance
 */
const chatController = (chatNsp, socket) => __awaiter(void 0, void 0, void 0, function* () {
    let handshake = socket.handshake;
    const qrData = JSON.parse(JSON.stringify(handshake.query));
    const staffs = ['admin', 'administrator', 'staff', 'security'];
    const connectionId = socket.id;
    // console.log("userId ", qrData.userId);
    if (qrData.userId) {
        socket.join(qrData.userId);
        socket.emit('connected', { data: { connectionId: connectionId }, message: "User connected successfully", error: false });
    }
    else {
        socket.emit('connected', { data: { connectionId: "", message: "Unable to connect. User Id must be provided", error: true } });
    }
    socket.on("disconnecting", (data) => {
        // socket.emit('ride-request-available', setMessage({}, 'resident: you are now connected', 'r-1', true));
        // console.log(qrData.senderName + " disconnecting");
    });
    /** subscribe to socket events */
    socket.on("subscribe-to-chat-events", (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const response = yield subscribeUserBackToAllThechats((_a = data.userId) !== null && _a !== void 0 ? _a : qrData.userId, socket);
        // console.log("all chat response", response);
        if (!response) {
            socket.emit('subscribe-to-chat-events-done', { data: [], message: "No chat available", error: false });
        }
        else {
            socket.emit('subscribe-to-chat-events-done', { data: response, message: "chat successfully retrieved", error: false });
        }
    }));
    /** subscribe to socket events */
    socket.on("initiate-a-chat", (data) => __awaiter(void 0, void 0, void 0, function* () {
        /**  check database if this chat between this id is existing
        * if found update the conversation
        * else save the query data and create the conversation
        */
        yield (0, initiate_chat_1.initiateChat)(data, qrData, socket);
    }));
    /** event to recieve sent message */
    socket.on("send-new-message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('send-new-message', data);
        if (data && data.chatId && data.message && data.senderId && data.receiverId) {
            yield (0, initiate_chat_1.insertNewMessage)(data.chatId, data, socket, "send-new-message-done", "message sent");
        }
        else {
            let chatId = Object.keys(data).includes("chatId") ? "" : "chatId is undefined";
            socket.emit("send-new-message-done", { data: data, message: "Incompleted parameter: " + chatId, error: true });
        }
    }));
    socket.on("get-messages", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('get-messages', data);
        const allMsg = yield (0, database_query_1.getConversation)(data.chatId);
        // retrieve message from database
        socket.emit('get-messages-done', { message: 'all messages retrieved', data: allMsg, error: false });
    }));
    socket.on("create-chat-group", (newData) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, initiate_chat_1.initiateNewGroupChat)(newData, qrData, socket);
    }));
    socket.on("add-user-to-group-chat", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('get-messages', data);
        const allMsg = yield (0, database_query_1.addUserToGroup)(data.chatId, data.userId);
        // retrieve message from database
        socket.emit('add-user-to-group-chat-done', { message: 'user added to the group successfully', data: allMsg, error: false });
    }));
    socket.on("acknowledge-message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('get-messages', data);
        const dbResponse = yield (0, database_query_1.acknowledgeMessage)(data.chatId, data.messageId);
        // retrieve message from database
        socket.emit('acknowledge-message-done', { message: 'message acknowledge successfully', data: { messageId: data.messageId }, error: false });
    }));
    socket.on("get-unread-messages", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('get-messages', data);
        const dbResponse = yield (0, database_query_1.getUnreadChats)(data.chatId);
        // retrieve message from database
        socket.emit('get-unread-messages-done', { message: 'Unread messages retrieved successfully', data: dbResponse[1], error: false });
    }));
    socket.on("delete-message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('get-messages', data);
        const dbResponse = yield (0, database_query_1.deleteMessage)(data.chatId, data.messageId);
        // retrieve message from database
        socket.emit('delete-message-done', { message: 'message deleted successfully', data: dbResponse, error: false });
    }));
    /** @todo implement database for closing chat */
    socket.on("close-chat", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('get-messages', data);
        const allMsg = yield (0, database_query_1.closeChat)(data.chatId);
        // retrieve message from database
        socket.emit('close-chat-done', { message: 'chat closed successfully', chatId: data.chatId, data: [], error: false });
    }));
});
exports.chatController = chatController;

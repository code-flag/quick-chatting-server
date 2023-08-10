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
exports.insertNewMessage = exports.initiateNewGroupChat = exports.initiateChat = void 0;
const unique_id_1 = require("../helper/library/unique-id");
const database_query_1 = require("../model/database/queries/database.query");
const chat_data_1 = require("./chat-data/chat-data");
const conversation_data_1 = require("./chat-data/conversation-data");
const pushNotification_query_1 = require("../model/database/queries/pushNotification.query");
const notification_1 = require("../helper/notification");
const get_visitor_supports_1 = require("../model/external-data/get-visitor-supports");
const sendPushNotificationToUser = (userId, message, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (Array.isArray(userId)) {
        userId.forEach((id) => __awaiter(void 0, void 0, void 0, function* () {
            const firebaseNotificationToken = yield (0, pushNotification_query_1.getNotificationToken)(id);
            if (firebaseNotificationToken) {
                const notificationResponse = yield (0, notification_1.sendPushNotification)("New-Chat-message", message, firebaseNotificationToken, data);
                // return notificationResponse;
            }
        }));
    }
    else {
        const firebaseNotificationToken = yield (0, pushNotification_query_1.getNotificationToken)(userId);
        if (firebaseNotificationToken) {
            const notificationResponse = yield (0, notification_1.sendPushNotification)("New-Chat-message", message, firebaseNotificationToken, data);
            // return notificationResponse;
        }
    }
});
const initiateChat = (data, qrData, socket) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, database_query_1.isChatExisting)(data.senderId, data.receiverId);
    // console.log("initiate chat", data, qrData, response?.chatId);
    if (!response) {
        yield (0, exports.insertNewMessage)("", data, socket, "initiate-a-chat-done", "Chat initiated successfully", true, qrData);
    }
    else {
        socket.emit("initiate-a-chat-done", { data: response, message: "chat already initiated", error: false });
    }
});
exports.initiateChat = initiateChat;
const initiateNewGroupChat = (data, qrData, socket) => __awaiter(void 0, void 0, void 0, function* () {
    if ((data === null || data === void 0 ? void 0 : data.useRequestId) && (data === null || data === void 0 ? void 0 : data.requestId)) {
        const response = yield (0, database_query_1.isChatIdExisting)(data === null || data === void 0 ? void 0 : data.requestId);
        if (!response) {
            yield (0, exports.insertNewMessage)("", data, socket, "create-chat-group-done", "Group chat created successfully", true, qrData, true);
        }
        else {
            socket.emit("create-chat-group-done", { data: response, message: "Group chat already exist.", error: false });
        }
    }
    else {
        yield (0, exports.insertNewMessage)("", data, socket, "create-chat-group-done", "Group chat created successfully", true, qrData, true);
    }
});
exports.initiateNewGroupChat = initiateNewGroupChat;
/**
 * This method handles chat creation and conversation updates both p-p converation initiatition and group creation
 * @param chatId
 * @param data
 * @param socket
 * @param eventName
 * @param message
 * @param newChat
 * @param qrData
 * @param isGroupChat
 * @returns
 */
const insertNewMessage = (chatId, data, socket, eventName, message, newChat = false, qrData, isGroupChat = false) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    try {
        if (newChat) {
            chatId = (0, unique_id_1.uniqueId)(16);
            if ((data === null || data === void 0 ? void 0 : data.useRequestId) && (data === null || data === void 0 ? void 0 : data.requestId) && isGroupChat) {
                chatId = data === null || data === void 0 ? void 0 : data.requestId;
            }
            const msgObj = (0, conversation_data_1.conversationData)(chatId, data.message, data.messageType, data.senderId, (_a = data.senderName) !== null && _a !== void 0 ? _a : null, (_b = data.senderRole) !== null && _b !== void 0 ? _b : null, (_c = data.senderAvatar) !== null && _c !== void 0 ? _c : null);
            // console.log('conversation data', msgObj);
            const conv = yield (0, database_query_1.createConversation)(msgObj);
            if (conv) {
                /** this line is for group chat */
                let errorStatus = false;
                try {
                    if ((data === null || data === void 0 ? void 0 : data.useRequestId) && (data === null || data === void 0 ? void 0 : data.requestId) && isGroupChat) {
                        let particiapants = (_d = data.particiapants) !== null && _d !== void 0 ? _d : [data.senderId, data.receiverId];
                        let participantsName = (_e = data.participantsName) !== null && _e !== void 0 ? _e : { [data.senderId]: (_f = data.senderName) !== null && _f !== void 0 ? _f : "N/A", [data.receiverId]: (_g = data.receiverName) !== null && _g !== void 0 ? _g : "N/A" };
                        const res = yield (0, database_query_1.createChat)((0, chat_data_1.chatData)(data === null || data === void 0 ? void 0 : data.requestId, qrData, conv._id, particiapants, participantsName, data === null || data === void 0 ? void 0 : data.groupName, true, data === null || data === void 0 ? void 0 : data.useRequestId, data === null || data === void 0 ? void 0 : data.requestId, data === null || data === void 0 ? void 0 : data.messageTitle));
                        socket.join(res.chatId);
                    }
                    else if (!(data === null || data === void 0 ? void 0 : data.useRequestId) && isGroupChat) {
                        let particiapants = [];
                        /** The help_desk here is used to determine the chat for help page chat
                         *  or a new website guest chat. We used it to initiate chat that would be
                         * broadcasted to all the support group
                         */
                        if (data.groupName && data.groupName.toLowerCase() == "help_desk") {
                            particiapants = (_h = yield (0, get_visitor_supports_1.getVisitorSupportTeam)()) !== null && _h !== void 0 ? _h : [];
                            data.receiverId = particiapants;
                            if ((particiapants === null || particiapants === void 0 ? void 0 : particiapants.length) == 0) {
                                errorStatus = true;
                            }
                            else {
                                particiapants.push(data.senderId);
                                let participantsName = (_j = data.participantsName) !== null && _j !== void 0 ? _j : { [data.senderId]: (_k = data.senderName) !== null && _k !== void 0 ? _k : "guest", [data.receiverId]: (_l = data.receiverName) !== null && _l !== void 0 ? _l : "Support Team" };
                                const res = yield (0, database_query_1.createChat)((0, chat_data_1.chatData)(chatId, qrData, conv._id, particiapants, participantsName, data === null || data === void 0 ? void 0 : data.groupName, true, data === null || data === void 0 ? void 0 : data.useRequestId, data === null || data === void 0 ? void 0 : data.requestId, data === null || data === void 0 ? void 0 : data.messageTitle));
                                socket.join(res.chatId);
                            }
                        }
                        else {
                            particiapants = (_m = data.particiapants) !== null && _m !== void 0 ? _m : [data.senderId, data.receiverId];
                            let participantsName = (_o = data.participantsName) !== null && _o !== void 0 ? _o : { [data.senderId]: (_p = data.senderName) !== null && _p !== void 0 ? _p : "N/A", [data.receiverId]: (_q = data.receiverName) !== null && _q !== void 0 ? _q : "N/A" };
                            const res = yield (0, database_query_1.createChat)((0, chat_data_1.chatData)(chatId, qrData, conv._id, particiapants, participantsName, data === null || data === void 0 ? void 0 : data.groupName, true, data === null || data === void 0 ? void 0 : data.useRequestId, data === null || data === void 0 ? void 0 : data.requestId, data === null || data === void 0 ? void 0 : data.messageTitle));
                            socket.join(res.chatId);
                        }
                    }
                    else if (!isGroupChat) {
                        let particiapants = (_r = data.particiapants) !== null && _r !== void 0 ? _r : [data.senderId, data.receiverId];
                        let participantsName = (_s = data.participantsName) !== null && _s !== void 0 ? _s : { [data.senderId]: (_t = data.senderName) !== null && _t !== void 0 ? _t : "N/A", [data.receiverId]: (_u = data.receiverName) !== null && _u !== void 0 ? _u : "N/A" };
                        const res = yield (0, database_query_1.createChat)((0, chat_data_1.chatData)(chatId, qrData, conv._id, particiapants, participantsName, data === null || data === void 0 ? void 0 : data.groupName, false, data === null || data === void 0 ? void 0 : data.useRequestId, data === null || data === void 0 ? void 0 : data.requestId, data === null || data === void 0 ? void 0 : data.messageTitle));
                        socket.join(res.chatId);
                    }
                    if (!errorStatus) {
                        socket.to(data.receiverId).emit('receive-new-message', { data: msgObj.conversation, chatId: msgObj.chatId, message: "new message received", "timestamp": new Date().toISOString(), error: false });
                        msgObj.meta = data === null || data === void 0 ? void 0 : data.meta;
                        socket.emit(eventName, { message: 'message initiated successfully', data: msgObj.conversation, chatId: msgObj.chatId, "timestamp": new Date().toISOString(), error: false });
                        yield sendPushNotificationToUser(data.receiverId, msgObj.conversation[0].message, msgObj.conversation);
                    }
                    else {
                        socket.emit(eventName, { message: 'Error: something went wrong', data: [], "timestamp": new Date().toISOString(), error: true });
                    }
                }
                catch (error) {
                    console.log("new message error", error);
                }
            }
            else {
                // console.log('conv', conv);
                socket.emit(eventName, { message: 'Something went wrong. Could not initiate the chat.', data: (_v = data === null || data === void 0 ? void 0 : data.meta) !== null && _v !== void 0 ? _v : [], "timestamp": new Date().toISOString(), error: false });
                return conv;
            }
        }
        else {
            try {
                const msgObj = (0, conversation_data_1.conversationData)(chatId, data.message, data.messageType, data.senderId, data.senderName, data.senderRole, data.senderAvatar);
                // insert new message
                yield (0, database_query_1.updateConversation)(msgObj);
                try {
                    socket.to(data.receiverId).emit('receive-new-message', { data: msgObj.conversation, chatId: msgObj.chatId, message: "new message received", "timestamp": new Date().toISOString(), error: false });
                    msgObj.meta = data === null || data === void 0 ? void 0 : data.meta;
                    socket.emit(eventName, { message: message, data: msgObj.conversation, chatId: msgObj.chatId, "timestamp": new Date().toISOString(), error: false });
                }
                catch (error) {
                    console.log("socket error", error);
                }
                try {
                    yield sendPushNotificationToUser(data.receiverId, msgObj.conversation[0].message, msgObj.conversation);
                }
                catch (error) {
                    console.log("firebase notification error", error);
                }
            }
            catch (error) {
                console.log("send new message error", error);
                socket.emit(eventName, { message: error.message, data: data, chatId: chatId !== null && chatId !== void 0 ? chatId : "undefined", "timestamp": new Date().toISOString(), error: false });
            }
        }
    }
    catch (error) {
        console.log("insert new message error: ", error);
    }
});
exports.insertNewMessage = insertNewMessage;

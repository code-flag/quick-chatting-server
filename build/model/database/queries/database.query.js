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
exports.deleteMessage = exports.acknowledgeMessage = exports.updateConversation = exports.getConversation = exports.createConversation = exports.getUserChats = exports.closeChat = exports.addUserToGroup = exports.getUnreadChats = exports.getChats = exports.createChat = exports.isChatIdExisting = exports.isChatExisting = void 0;
const chat_schema_1 = require("../schemas/chat.schema");
const chat_schema_2 = require("../schemas/chat.schema");
const isChatExisting = (idOne, idTwo) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_1.chatRooms.findOne({
        participants: { $size: 2, $all: [idOne, idTwo] }
    }).populate('conversations');
    return chatInfo;
});
exports.isChatExisting = isChatExisting;
const isChatIdExisting = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_1.chatRooms.findOne({ chatId: chatId }).populate('conversations');
    return chatInfo;
});
exports.isChatIdExisting = isChatIdExisting;
const createChat = (chatData) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_1.chatRooms.create(chatData);
    return chatInfo;
});
exports.createChat = createChat;
/** Used to get a specific chat conversations */
const getChats = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_1.chatRooms.findOne({ isActive: true, chatId: chatId }).populate('conversations');
    return chatInfo;
});
exports.getChats = getChats;
/** Used to get a specific chat conversations */
const getUnreadChats = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /**@example this block code return all the data plus the main result as two array */
        const chatInfo = yield chat_schema_2.conversations.aggregate([
            { "$project": {
                    "conversation": { "$setDifference": [
                            { "$map": {
                                    "input": "$conversation",
                                    "as": "el",
                                    "in": { "$cond": [
                                            { "$eq": ["$$el.isRead", false] },
                                            "$$el",
                                            false
                                        ] }
                                } },
                            [false]
                        ] }
                } }
        ]);
        // const chatInfo: any = await conversations.aggregate([
        //     {
        //       $addFields: {
        //         conversation: {
        //           $filter: {
        //             input: "$conversation",
        //             as: "data",
        //             cond: {
        //               $gt: [
        //                 "$$data.isRead",
        //                 false
        //               ]
        //             }
        //           }
        //         }
        //       }
        //     }
        //   ]);
        /** @example for getting a single unread message */
        // const chatInfo: any = await conversations.find(
        //     {chatId: chatId}, 
        //     {"conversation" : {$elemMatch: {"isRead": false}}}
        // );
        return chatInfo;
    }
    catch (error) {
        console.log("error from unred ", error);
        return null;
    }
});
exports.getUnreadChats = getUnreadChats;
/** used to add user into a groupm chat */
const addUserToGroup = (chatId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_1.chatRooms.findOne({ isActive: true, chatId: chatId });
    if (chatInfo) {
        // update the participants
        return yield chat_schema_1.chatRooms.updateOne({ chatId: chatId }, { $addToSet: { participants: userId } }, { new: true });
    }
    else {
        return false;
    }
});
exports.addUserToGroup = addUserToGroup;
/** Used to make a chat inactive */
const closeChat = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_1.chatRooms.findOne({ isActive: true, chatId: chatId });
    if (chatInfo) {
        // update the participants
        return yield chat_schema_1.chatRooms.updateOne({ chatId: chatId }, { isActive: false });
    }
    else {
        return false;
    }
});
exports.closeChat = closeChat;
/**
 * Used to get all users active chats
 * @param userId - user Id
 * @returns
 */
const getUserChats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_1.chatRooms.find({ participants: { $all: [userId] }, isActive: true }).populate('conversations');
    return chatInfo;
});
exports.getUserChats = getUserChats;
const createConversation = (conversationData) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_2.conversations.create(conversationData);
    return chatInfo;
});
exports.createConversation = createConversation;
const getConversation = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_2.conversations.findOne({ chatId: chatId });
    return chatInfo;
});
exports.getConversation = getConversation;
const updateConversation = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield chat_schema_2.conversations.findOne({ chatId: data.chatId });
        if (conversation) {
            // update the conversation
            return yield chat_schema_2.conversations.updateOne({ chatId: data.chatId }, { $addToSet: { conversation: data.conversation[0] } }, { new: true });
        }
        else {
            return false;
        }
    }
    catch (error) {
        // console.log("error from db", error);
    }
});
exports.updateConversation = updateConversation;
const acknowledgeMessage = (chatId, messageId) => __awaiter(void 0, void 0, void 0, function* () {
    if (chatId && messageId) {
        // update the conversation
        const resp = yield chat_schema_2.conversations.findOneAndUpdate({ $and: [{ chatId: chatId }, { "conversation": { $elemMatch: { "messageId": messageId } } }] }, { $set: {
                "conversation.$.isRead": true
            }
        });
        return resp;
    }
    else {
        return false;
    }
});
exports.acknowledgeMessage = acknowledgeMessage;
const deleteMessage = (chatId, messageId) => __awaiter(void 0, void 0, void 0, function* () {
    const resp = yield chat_schema_2.conversations.updateOne({ chatId: chatId }, {
        $pull: {
            "conversation": { "messageId": messageId }
        }
    }, { safe: true });
    return resp;
});
exports.deleteMessage = deleteMessage;

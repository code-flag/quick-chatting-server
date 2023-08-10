"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationData = void 0;
const unique_id_1 = require("../../helper/library/unique-id");
const conversationData = (chatId, message, messageType, senderId, senderName, senderRole, senderAvatar) => {
    const data = {
        chatId: chatId,
        conversation: [{
                message: message,
                messageId: (0, unique_id_1.uniqueId)(10),
                messageType: messageType,
                senderId: senderId,
                senderName: senderName !== null && senderName !== void 0 ? senderName : "",
                senderRole: senderRole !== null && senderRole !== void 0 ? senderRole : null,
                senderAvatar: senderAvatar !== null && senderAvatar !== void 0 ? senderAvatar : null,
                timeCreated: new Date().toISOString()
            }]
    };
    return data;
};
exports.conversationData = conversationData;

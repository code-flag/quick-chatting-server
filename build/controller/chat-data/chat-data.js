"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatData = void 0;
const chatData = (chatID, qrData, conversationId, participants, participantsName, groupName, isGroupChat, useRequestId, requestId, messageTitle) => {
    const data = {
        chatId: chatID,
        productId: qrData.productId,
        accessId: qrData.accessId,
        productName: qrData.productName,
        requestId: requestId !== null && requestId !== void 0 ? requestId : null,
        messageTitle: messageTitle !== null && messageTitle !== void 0 ? messageTitle : "N/A",
        groupName: groupName !== null && groupName !== void 0 ? groupName : null,
        useRequestId: useRequestId,
        conversations: conversationId,
        participants: participants,
        participantNames: participantsName,
        isGroupChat: isGroupChat !== null && isGroupChat !== void 0 ? isGroupChat : false,
        isActive: true
    };
    // console.log('User connected successfully: Handshake data', data);
    return data;
};
exports.chatData = chatData;

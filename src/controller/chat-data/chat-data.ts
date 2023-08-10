export const chatData = (chatID: string, qrData: any, conversationId: string, participants: Array<string>, participantsName: any, groupName?: string, isGroupChat?: boolean, useRequestId?: string, requestId?: string, messageTitle?: string) => {
    const data = {
        chatId: chatID,
        productId: qrData.productId, // gate-house access key
        accessId: qrData.accessId, // estate id
        productName: qrData.productName, // gate-house
        requestId: requestId ?? null,
        messageTitle: messageTitle ?? "N/A",
        groupName: groupName ?? null,
        useRequestId: useRequestId,
        conversations: conversationId,
        participants: participants,
        participantNames: participantsName,
        isGroupChat: isGroupChat ?? false,
        isActive: true
    }
    // console.log('User connected successfully: Handshake data', data);
    return data;
}
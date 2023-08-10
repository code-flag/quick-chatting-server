import { uniqueId } from "../../helper/library/unique-id";

export const conversationData = (chatId: string, message: string, messageType: string, senderId: string, senderName?: string, senderRole?: string,
    senderAvatar?: string) => {
    const data = {
        chatId: chatId,
        conversation: [{
            message: message,
            messageId: uniqueId(10),
            messageType: messageType,
            senderId: senderId,
            senderName: senderName ?? "",
            senderRole: senderRole ?? null,
            senderAvatar: senderAvatar ?? null,
            timeCreated: new Date().toISOString()
        }]
    }

    return data;
}
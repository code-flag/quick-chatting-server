import { uniqueId } from "../helper/library/unique-id";
import { addUserToGroup, createChat, createConversation, deleteMessage, isChatExisting, isChatIdExisting, updateConversation } from "../model/database/queries/database.query";
import { Socket } from "socket.io";
import { chatData } from "./chat-data/chat-data";
import { conversationData } from "./chat-data/conversation-data";
import { getNotificationToken } from "../model/database/queries/pushNotification.query";
import { sendPushNotification } from "../helper/notification";
import { getVisitorSupportTeam } from "../model/external-data/get-visitor-supports";


const sendPushNotificationToUser = async (userId: any, message: string, data: any) => {
    if (Array.isArray(userId)) {
        userId.forEach(async (id: string) => {
            const firebaseNotificationToken = await getNotificationToken(id);
            if (firebaseNotificationToken) {
                const notificationResponse = await sendPushNotification("New-Chat-message", message, firebaseNotificationToken, data);
                // return notificationResponse;
            }
        });
    } else {
        const firebaseNotificationToken = await getNotificationToken(userId);
        if (firebaseNotificationToken) {
            const notificationResponse = await sendPushNotification("New-Chat-message", message, firebaseNotificationToken, data);
            // return notificationResponse;
        }

    }
}


export const initiateChat = async (data: any, qrData: any, socket: Socket) => {
    const response = await isChatExisting(data.senderId, data.receiverId);

    // console.log("initiate chat", data, qrData, response?.chatId);

    if (!response) {
        await insertNewMessage("", data, socket, "initiate-a-chat-done", "Chat initiated successfully", true, qrData)
    }
    else {
        socket.emit("initiate-a-chat-done", { data: response, message: "chat already initiated", error: false });
    }
}


export const initiateNewGroupChat = async (data: any, qrData: any, socket: Socket) => {
    if (data?.useRequestId && data?.requestId) {
        const response = await isChatIdExisting(data?.requestId);
        if (!response) {
            await insertNewMessage("", data, socket, "create-chat-group-done", "Group chat created successfully", true, qrData, true);
        }
        else {
            socket.emit("create-chat-group-done", { data: response, message: "Group chat already exist.", error: false });
        }
    }
    else {
        await insertNewMessage("", data, socket, "create-chat-group-done", "Group chat created successfully", true, qrData, true);
    }
}


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
export const insertNewMessage = async (chatId: string, data: any, socket: Socket, eventName: string, message: string, newChat = false, qrData?: any, isGroupChat: boolean = false) => {
    try {
        if (newChat) {
            chatId = uniqueId(16);

            if (data?.useRequestId && data?.requestId && isGroupChat) {
                chatId = data?.requestId;
            }

            const msgObj: any = conversationData(
                chatId,
                data.message,
                data.messageType,
                data.senderId,
                data.senderName ?? null,
                data.senderRole ?? null,
                data.senderAvatar ?? null
            );

            // console.log('conversation data', msgObj);
            const conv: any = await createConversation(msgObj);
            if (conv) {
                /** this line is for group chat */
                let errorStatus = false;
                try {
                    if (data?.useRequestId && data?.requestId && isGroupChat) {
                        let particiapants = data.particiapants ?? [data.senderId, data.receiverId];
                        let participantsName = data.participantsName ?? { [data.senderId]: data.senderName ?? "N/A", [data.receiverId]: data.receiverName ?? "N/A" };
                        const res = await createChat(chatData(data?.requestId, qrData, conv._id, particiapants, participantsName, data?.groupName, true, data?.useRequestId, data?.requestId, data?.messageTitle));
                        socket.join(res.chatId);
                    }
                    else if (!data?.useRequestId && isGroupChat) {
                        let particiapants: Array<any> = [];

                        /** The help_desk here is used to determine the chat for help page chat
                         *  or a new website guest chat. We used it to initiate chat that would be 
                         * broadcasted to all the support group
                         */
                        if (data.groupName && data.groupName.toLowerCase() == "help_desk") {

                            particiapants = await getVisitorSupportTeam() ?? [];
                            data.receiverId = particiapants;
                            if (particiapants?.length == 0) {
                                errorStatus = true;
                            } else {
                                particiapants.push(data.senderId);
                                let participantsName = data.participantsName ?? { [data.senderId]: data.senderName ?? "guest", [data.receiverId]: data.receiverName ?? "Support Team" };
                                const res = await createChat(chatData(chatId, qrData, conv._id, particiapants, participantsName, data?.groupName, true, data?.useRequestId, data?.requestId, data?.messageTitle));
                                socket.join(res.chatId);
                            }
                        }
                        else {
                            particiapants = data.particiapants ?? [data.senderId, data.receiverId];
                            let participantsName = data.participantsName ?? { [data.senderId]: data.senderName ?? "N/A", [data.receiverId]: data.receiverName ?? "N/A" };
                            const res = await createChat(chatData(chatId, qrData, conv._id, particiapants, participantsName, data?.groupName, true, data?.useRequestId, data?.requestId, data?.messageTitle));
                            socket.join(res.chatId);
                        }


                    }
                    else if (!isGroupChat) {
                        let particiapants = data.particiapants ?? [data.senderId, data.receiverId];
                        let participantsName = data.participantsName ?? { [data.senderId]: data.senderName ?? "N/A", [data.receiverId]: data.receiverName ?? "N/A" };
                        const res = await createChat(chatData(chatId, qrData, conv._id, particiapants, participantsName, data?.groupName, false, data?.useRequestId, data?.requestId, data?.messageTitle));
                        socket.join(res.chatId);
                    }

                    if (!errorStatus) {
                        socket.to(data.receiverId).emit('receive-new-message', { data: msgObj.conversation, chatId: msgObj.chatId, message: "new message received", "timestamp": new Date().toISOString(), error: false });
                        msgObj.meta = data?.meta;
                        socket.emit(eventName, { message: 'message initiated successfully', data: msgObj.conversation, chatId: msgObj.chatId, "timestamp": new Date().toISOString(), error: false });

                        await sendPushNotificationToUser(data.receiverId, msgObj.conversation[0].message, msgObj.conversation);
                    }
                    else {
                        socket.emit(eventName, { message: 'Error: something went wrong', data: [], "timestamp": new Date().toISOString(), error: true});
                    }
                } catch (error) {
                    console.log("new message error", error);
                }
            }
            else {
                // console.log('conv', conv);
                socket.emit(eventName, { message: 'Something went wrong. Could not initiate the chat.', data: data?.meta ?? [], "timestamp": new Date().toISOString(), error: false });
                return conv;
            }
        } else {
            try {

                const msgObj: any = conversationData(
                    chatId,
                    data.message,
                    data.messageType,
                    data.senderId,
                    data.senderName,
                    data.senderRole,
                    data.senderAvatar
                );

                // insert new message
                await updateConversation(msgObj);

                try {
                    socket.to(data.receiverId).emit('receive-new-message', { data: msgObj.conversation, chatId: msgObj.chatId, message: "new message received", "timestamp": new Date().toISOString(), error: false });
                    msgObj.meta = data?.meta;
                    socket.emit(eventName, { message: message, data: msgObj.conversation, chatId: msgObj.chatId, "timestamp": new Date().toISOString(), error: false });
                } catch (error) {
                    console.log("socket error", error);
                }
                try {
                    await sendPushNotificationToUser(data.receiverId, msgObj.conversation[0].message, msgObj.conversation);
                } catch (error) {
                    console.log("firebase notification error", error);
                }

            } catch (error: any) {
                console.log("send new message error", error);
                socket.emit(eventName, { message: error.message, data: data, chatId: chatId ?? "undefined", "timestamp": new Date().toISOString(), error: false });
            }
        }
    } catch (error: any) {
        console.log("insert new message error: ", error);
    }


}
/**
 * This file contain all the methods needs to create a chat for a user
 */
import { acknowledgeMessage, addUserToGroup, closeChat, deleteMessage, getConversation, getUnreadChats, getUserChats } from "../model/database/queries/database.query";
import { Namespace, Socket } from "socket.io";
import { initiateChat, initiateNewGroupChat, insertNewMessage } from "./initiate-chat";

/** get all user chats and subcribes back to all chat chats */
const subscribeUserBackToAllThechats = async (userId: string, socket: Socket) => {
    try {
        const response: any = await getUserChats(userId);
        // console.log("responsesss ", response);
        // console.log('User added back to the following chats:');
        response.map((chat: any) => {
            socket.join(chat.chatId);
            // console.log("chat - ", chat.chatId);
        });
        return response;
    } catch (error) {
        console.log("subscription error", error);
        return false;
    }
}


/**
 *
 * @param {Namespace} chatNsp - resident route namespace
 * @param {*} socket - socket instance
 */
export const chatController = async (chatNsp: Namespace, socket: Socket) => {

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
    socket.on("subscribe-to-chat-events", async (data) => {
        const response: any = await subscribeUserBackToAllThechats(data.userId ?? qrData.userId, socket);
        // console.log("all chat response", response);

        if (!response) {
            socket.emit('subscribe-to-chat-events-done', { data: [], message: "No chat available", error: false });
        }
        else {
            socket.emit('subscribe-to-chat-events-done', { data: response, message: "chat successfully retrieved", error: false });
        }
    });

    /** subscribe to socket events */
    socket.on("initiate-a-chat", async (data) => {
        /**  check database if this chat between this id is existing
        * if found update the conversation
        * else save the query data and create the conversation
        */
        await initiateChat(data, qrData, socket);

    });

    /** event to recieve sent message */
    socket.on("send-new-message", async (data) => {
        // console.log('send-new-message', data);
        if (data && data.chatId && data.message && data.senderId && data.receiverId) {
            await insertNewMessage(data.chatId, data, socket, "send-new-message-done", "message sent");
        }
        else {
            let chatId = Object.keys(data).includes("chatId") ? "" : "chatId is undefined";
            socket.emit("send-new-message-done", { data: data, message: "Incompleted parameter: " + chatId, error: true });
        }

    });

    socket.on("get-messages", async (data) => {
        // console.log('get-messages', data);
        const allMsg: any = await getConversation(data.chatId);
        // retrieve message from database
        socket.emit('get-messages-done', { message: 'all messages retrieved', data: allMsg, error: false });
    });

    socket.on("create-chat-group", async (newData) => {
        await initiateNewGroupChat(newData, qrData, socket);
    });

    socket.on("add-user-to-group-chat", async (data) => {
        // console.log('get-messages', data);
        const allMsg: any = await addUserToGroup(data.chatId, data.userId);
        // retrieve message from database
        socket.emit('add-user-to-group-chat-done', { message: 'user added to the group successfully', data: allMsg, error: false });
    });

    socket.on("acknowledge-message", async (data) => {
        // console.log('get-messages', data);
        const dbResponse: any = await acknowledgeMessage(data.chatId, data.messageId);
        // retrieve message from database
        socket.emit('acknowledge-message-done', { message: 'message acknowledge successfully', data: { messageId: data.messageId }, error: false });
    });

    socket.on("get-unread-messages", async (data) => {
        // console.log('get-messages', data);
        const dbResponse: any = await getUnreadChats(data.chatId);
        // retrieve message from database
        socket.emit('get-unread-messages-done', { message: 'Unread messages retrieved successfully', data: dbResponse[1] , error: false });
    });

    socket.on("delete-message", async (data) => {
        // console.log('get-messages', data);
        const dbResponse: any = await deleteMessage(data.chatId, data.messageId);
        // retrieve message from database
        socket.emit('delete-message-done', { message: 'message deleted successfully', data: dbResponse, error: false });
    });

    /** @todo implement database for closing chat */
    socket.on("close-chat", async (data) => {
        // console.log('get-messages', data);
        const allMsg: any = await closeChat(data.chatId)
        // retrieve message from database
        socket.emit('close-chat-done', { message: 'chat closed successfully', chatId: data.chatId, data: [], error: false });
    });

};

/**
 * @author Francis Olawumi Awe <awefrancolaz@gamil.com>
 * This file shows cpaat messenger socket event connections and parameters
 * Note: 
 *  - for every event fire there is always a done event to it
 * @example 
 *  send-new-message - response -> send-new-message-done
 */

/** Use the below method to connect to the socket: maybe in app root level */

const userSocketConn = io(`messenger.gate-house.com/chat`, {
    transports: ["websocket", "polling"],
    query: { 
       productName: "Gate-house",
        productId: "87bhrwigds78w",
        accessId: 'dkls96s5rsiu792wh0',
        userId: "4fsd6s3sgs645s1",
    },
  });

// listen to connection event 
 userSocketConn.on("connected", (socketData) => {
    const { data } = socketData;
    let connectionId = data && data.connectionId ? data.connectionId : null;
    console.log('socket connected', connectionId);
  });

  userSocketConn.on("error", (data) => {
    console.log("socket event error", error);
  });

  const subscribeToChatEvent = (userId) => {
    userSocketConn.emit("subscribe-to-chat-events", {userId: userId})
  }

  const initiateNewChat = (message, messageType, senderId, receiverId, senderName , senderRole , senderAvatar ) => {
    userSocketConn.emit("initiate-a-chat", {
            message: message,
            messageType: messageType,
            senderId: senderId,
            receiverId: receiverId,
            senderName: senderName ?? null,
            senderRole: senderRole ?? null,
            senderAvatar: senderAvatar ?? null
        })
  }

  const initiateNewGroupChat = (message, messageType, senderId, receiverId, useRequestId, requestId, groupName, senderName, senderRole, senderAvatar) => {
    userSocketConn.emit("create-chat-group", {
        message: message,
        messageType: messageType,
        senderId: senderId,
        receiverId: receiverId,
        senderName: senderName ?? null,
        senderRole: senderRole ?? null,
        senderAvatar: senderAvatar ?? null,
        groupName: groupName,
        useRequestId: useRequestId, // boolean true if requestID IS TO BE USE
        requestId: requestId,
        isGroupChat: true
    })
  }

  const sendMessage = (message, messageType, senderId, receiverId, senderName , senderRole , senderAvatar ) => {
    userSocketConn.emit("send-new-message", {
            message: message,
            messageType: messageType,
            senderId: senderId,
            receiverId: receiverId,
            senderName: senderName ?? null,
            senderRole: senderRole ?? null,
            senderAvatar: senderAvatar ?? null
        })
  }
  const addUserToChat = (chatId, userId) => {
    userSocketConn.emit("add-user-to-group-chat", {chatId: chatId, userId: userId})
  }

  const getChats = (chatId) => {
    userSocketConn.emit("get-messages", {chatId: chatId})
  }

  const closeChat = (chatId) => {
    userSocketConn.emit('close-chat', {chatId: chatId})
  }

  const acknowledgeMessage = (messageId) => {
    userSocketConn.emit('close-chat', {messageId: messageId})
  }



//   listen to all other event 
  const listenToAllMsgEvents = (socket = userSocketConn ) => {

     /** ======================== subscribe-to-chat-events==================== */
     socket.on('subscribe-to-chat-events', (data) => {
        console.log('subscribe-to-chat-events-done', data);
        });

      /** ======================== recieve new message ==================== */
      socket.on('receive-new-message', (data) => {
        console.log('new message ', data);
        });

    /** ======================== recieve new message ==================== */
    socket.on('receive-new-message', (data) => {
        console.log('new message ', data);
        }); 
  
    /** ======================== send new message ==================== */
      socket.on('send-new-message-done', (data) => {
        console.log('send-new-message-done', data);
      });  

     /** ======================== get messages ==================== */
     socket.on('get-messages-done', (data) => {
        console.log('get-messages-done', data);
      });  


    /** ======================== initiate group message ==================== */
    socket.on('create-chat-group-done', (data) => {
        console.log('create-chat-group-done', data);
      });  

       /** ======================== add user to group chat ==================== */
     socket.on('add-user-to-group-chat-done', (data) => {
        console.log('add-user-to-group-chat-done', data);
      });  

      /** ======================== initiate a new chat ==================== */
     socket.on('initiate-a-chat-done', (data) => {
        console.log('initiate-a-chat-done', data);
      });  


     /** ======================== acknowledge message ==================== */
     socket.on('acknowledge-message-done', (data) => {
        console.log('acknowledge-message-done', data);
      });  


    /** ======================== delete or deactivate chat ==================== */
    socket.on('close-chat-done', (data) => {
        console.log('close-chat-done', data);
      });  

  }











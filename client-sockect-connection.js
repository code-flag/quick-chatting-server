// connect to the messenger web socket

// include socket library
<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>;
// connect to socket via api endpoint
socketConn = io(`https://cpaat-messenger.onrender.com/chat`, {
  transports: ["websocket", "polling"],
  query: {
    productName: "Gate-house", // this maybe estate name or the name of product used for
    productId: "87bhrwigds78w", // this maybe estate Id
    accessId: "dkls96s5rsiu792wh0", // this will be access token for a particular product - not available for now
    senderId: "sg34g545efs2m", // it could be user or admin
    senderName: "Jame Bond", // user name
    senderAvatar: "avatar", // base64 img string
    /**
     * @property {string} senderRole - This field define how the message is handle from the backend
     * sender role could be one of the following
     * - user : should only be used for registered user
     * - visitor : should only be used for unregistered user
     * 
     * - staff : should be used for admin purpose
     * - security : should be used for admin purpose
     * - admin: should be used for admin purpose
     */
    senderRole: "user", 
    receiverId: "4fsd6s3sgs645s1", // the person recieving the message. it could be user or admin
    receiverName: "Mark Mosh", // reciever name
    receiverAvatar: "avatar", // reciever image in base64 string
    /**
     * @property {string} receiverRole - This field define how the message is handle from the backend
     * sender role could be one of the following
     * - user : should only be used for registered user
     * - visitor : should only be used for unregistered user
     * 
     * - staff : should be used for admin purpose
     * - security : should be used for admin purpose
     * - admin: should be used for admin purpose
     */
    receiverRole: "staff",  // 
  },
});

// connection Events
socketConn.on("connected", (socketData) => {
  const { data } = socketData;
  let connectionId = data && data.connectionId ? data.connectionId : null;
  console.log("socket connected", connectionId);
  console.log("previous chats data", data.chats);
});

socketConn.on("error", (data) => {
  // Expose error for test checking
});

//   send user new message
residentConn.emit("send-new-message", {
  message: msg,
  messageType: "text",
});
//  server acknowledgement event for message sent
socket.on("send-new-message-done", (data) => {
  console.log("send-new-message-done: server response", data);
});

// recieve new message from other user
socket.on("receive-new-message", (data) => {
  console.log("receive-new-message: new message from other user", data);
  let msg = data.message;
});

// get all messages
socket.on("old-messages", (data) => {
  console.log("old messages:", data);
});

// get all messages acknowledgement event
socket.on("old-messages-done", (data) => {
  console.log("old messages-done: servver response", data);
});

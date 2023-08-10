const setMessage = require("../message/message-handler");

/**
 * 
 * @param {string} eventType - event name e.g ride-request
 * @param {socket} sender - namespace of a socket
 * @param {string} room - the room to which we are boadcasting to
 * @param {object} data - the data we are passing to the subscribers
 * @param {string} msg - the message we are sending along
 * @param {number|null} errCode - the defined error code if there is error else null
 * @param {boolean} msgStatus - true if msg passed is success msg and false if msg passed is error msg
 */
export const  broadcastToRoom = (eventType: string, sender: any, room: string, data: any, msg: string, errCode: any, msgStatus: boolean) => {
    sender.to(room).emit(eventType, setMessage(data, msg, errCode, msgStatus));
}

/**
 * Emit to a single user with provided socket id 
 * @param {Socket} socket - sender socket instance
 * @param {string} recieverSocketId - receiver socket id
 * @param {string} eventName - event to emit to receiver
 * @param {*} msg - data or message to be sent to receiver
 */
export const broadcastToOneUser = (socket: any, recieverSocketId: string, eventName: string, msg: string) => {
    console.log('socket id', recieverSocketId, 'eventname', eventName);
    socket.to(recieverSocketId).emit(eventName, msg);
}

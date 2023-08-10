"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastToOneUser = exports.broadcastToRoom = void 0;
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
const broadcastToRoom = (eventType, sender, room, data, msg, errCode, msgStatus) => {
    sender.to(room).emit(eventType, setMessage(data, msg, errCode, msgStatus));
};
exports.broadcastToRoom = broadcastToRoom;
/**
 * Emit to a single user with provided socket id
 * @param {Socket} socket - sender socket instance
 * @param {string} recieverSocketId - receiver socket id
 * @param {string} eventName - event to emit to receiver
 * @param {*} msg - data or message to be sent to receiver
 */
const broadcastToOneUser = (socket, recieverSocketId, eventName, msg) => {
    console.log('socket id', recieverSocketId, 'eventname', eventName);
    socket.to(recieverSocketId).emit(eventName, msg);
};
exports.broadcastToOneUser = broadcastToOneUser;

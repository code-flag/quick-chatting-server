"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffController = void 0;
/**
 *
 * @param {Namespace} staffNsp - staff route namespace
 * @param {*} socket - socket instance
 * @param {*} staffId - staff Id
 * @param {*} residentNsp - rider route namespace
 * @param {*} io - socket io
 */
const staffController = (staffNsp, socket, staffId, residentNsp, io) => {
    /**
     * Get the connection ID. We will pass this to all the for  `makeSingleCall` to ensure that
     * each event call by client is linked to a specific client and is unique
     */
    const connectionId = socket.id;
    console.log("staff connected", connectionId, staffId);
    socket.join("staffRooms_user");
    console.log("staff added back to the following room", socket.rooms);
    // const staffRooms = getUserRooms(staffId);
    // console.log("staff join room", staffRooms);
    //resubscribe a staff to previously join rooms if any
    // this is implemented to avoid bridge in communication when user socket disconnected
    // if (staffRooms !== null) {
    //   //add staff back to all previously join room
    //   socket.join(staffRooms);
    //   console.log("staff added back to the following room", socket.rooms);
    //   // staffRooms.forEach(async (element) => {
    //   //   socket.join(element);
    //   // });
    // } else {
    //   // if not in any room before, then add staff to available room to get all events
    //   socket.join("available-staff");
    // }
    // socket.emit('connected', {connectionId: socket.id});
    socket.on("staff-subscribe", (data) => {
        console.log("connect", data.id);
        socket.emit("staff-connected", data.id);
    });
    socket.on("disconnecting", (data) => {
        // socket.emit('ride-request-available', setMessage({}, 'staff: you are now connected', 'r-1', true));
        console.log("staff disconnecting");
    });
    socket.on("staff-send-message", (data) => {
        console.log('staff sent message', data);
        residentNsp.to("staffRooms_user").emit('staff-message', { message: data.message, name: data.name, error: false });
        socket.emit('staff-message-done', { message: 'messsage sent', data: data, error: false });
    });
    socket.on("staff-message-recieve", (data) => {
        console.log('recieved message', data);
        residentNsp.to("staffRooms_user").emit('staff-message-reponse', { message: 'I sent a message', data: data, error: false });
    });
};
exports.staffController = staffController;

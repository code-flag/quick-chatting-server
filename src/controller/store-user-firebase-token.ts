import { updateNotificationToken } from "../model/database/queries/pushNotification.query";

export const storeUserFirebaseToken = async (request: any, response: any) => {
    const {firebaseNotificationToken, userId} = request.body;
    console.log("user firebaseNotificationToken, userId", firebaseNotificationToken, userId);
    let data ;

    if (userId && firebaseNotificationToken) {
        const dbResponse = await updateNotificationToken(userId, firebaseNotificationToken);
        data = dbResponse;
        // console.log("dbResponse", dbResponse); 
    }
    response.status(200).json({
        message: "success",
        // data: data
    });
}
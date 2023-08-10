import { pushNotificationID } from "../schemas/notification-data.schema";



export const isNotificationIdExisting = async (userId: string) => {
    const notificationToken: any = await pushNotificationID.findOne({ userId: userId});
    console.log('notificationToken', notificationToken);
    return notificationToken;
}

export const createNotificationToken = async (userId: string, token: string) => {
    const notificationToken = await pushNotificationID.create({userId: userId, firebaseNotificationToken: token});
    return notificationToken;
}

/** Used to get a specific NotificationToken conversations */
export const getNotificationToken = async (userId: string) => {
    const notificationToken: any = await pushNotificationID.findOne({userId: userId});
    return notificationToken?.firebaseNotificationToken;
}

export const updateNotificationToken = async (userId: string, token: string) => {
    const dbResponse: any = await pushNotificationID.findOne({userId: userId});
 
    if (!dbResponse) {
        const notificationToken = await pushNotificationID.create({userId: userId, firebaseNotificationToken: token});
       return notificationToken;
    }
    else {
        if (dbResponse.firebaseNotificationToken !== token) {
            return await pushNotificationID.updateOne({userId: userId}, { firebaseNotificationToken: token } );
        }
    }
}
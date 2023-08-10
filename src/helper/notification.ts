import admin from "firebase-admin";
import debug from "debug";

const DEBUG = debug("dev");

export async function sendPushNotification(title: string, msg: string, token: string, data: any) {

 if (data != undefined) {
    data["click_action"] = "FLUTTER_NOTIFICATION_CLICK";
    data["timestamp"] = new Date().toLocaleString();
  }else {
    data = {"click_action": "FLUTTER_NOTIFICATION_CLICK", timestamp: new Date().toLocaleString()}
  }
  

  const message = {
    data: data,
    notification: {
      title: title,
      body: msg
    },
    token: token,
  };

  admin
    .messaging()
    .send(message)
    .then((response: any) => {
      DEBUG(`Notification sent: ${response}`);
    })
    .catch((error: any) => {
      DEBUG(`Error sending notification: ${error}`);
    });
}


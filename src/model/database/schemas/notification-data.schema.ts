import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;
const PushNotificationID = new Schema({
    userId: {type: String, required: true}, // this is combination of senderId and receiverId e.g user1-ID_user2-ID  5we65451sd154sf_s94s64dfsf6ag8
    firebaseNotificationToken: {type: String, required: true}
}, {
  timestamps: true
});

PushNotificationID.set("toJSON", {
    transform: function (doc, ret, options) {
      delete ret.__v;
    },
  });

  PushNotificationID.plugin(mongoosePaginate);

  export const pushNotificationID = mongoose.model("PushNotificationID", PushNotificationID);
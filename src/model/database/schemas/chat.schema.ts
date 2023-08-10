import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const ChatRoomSchema = new Schema({
    chatId: {type: String, required: true}, // this is combination of senderId and receiverId e.g user1-ID_user2-ID  5we65451sd154sf_s94s64dfsf6ag8
    productId: {type: String,default: null}, // gate-house access key
    accessId: {type: String,default: null}, // estate id
    productName: {type: String,default: null}, // gate-house
    requestId: {type: String,default: null},
    messageTitle: {type: String,default: null},
    isGroupChat: {type: Boolean, required: false, default: false},
    groupName: {type: String, default: null},
    /** participants contains the Id of all the persons involve in a chat */
    participants: [],
    participantsName: {}, // this contain the sender and reciever name while their id is the key and their name is the value
    useRequestId: {type: Boolean, default: false},
    conversations: {type: Schema.Types.ObjectId, required: true, ref: "Conversations"},
    isActive: {type: Boolean, required: false, default: true}
}, {
  timestamps: true
});
 
const ConversationsSchema = new Schema({
    chatId: {type: String, required: true},
    conversation: [
      {
      message: {type: String, required: true},
      messageId: {type: String, required: true},
      messageType: {type: String, default: 'text'},
      senderId: {type: String, required: true},
      senderRole: {type: String, required: false},
      senderAvatar: {type: String, required: false},
      senderName: {type: String, default: ""},
      isRead: {type: Boolean, required: false, default: false},
      timeCreated: {type: String, required: true}
    }
    ]
},{
  timestamps: true
});

  ChatRoomSchema.set("toJSON", {
    transform: function (doc, ret, options) {
      delete ret.__v;
    },
  });
  ConversationsSchema.set("toJSON", {
    transform: function (doc, ret, options) {
      delete ret.__v;
    },
  });

  ChatRoomSchema.plugin(mongoosePaginate);
  ConversationsSchema.plugin(mongoosePaginate);

  export const chatRooms = mongoose.model("ChatRooms", ChatRoomSchema);
  export const conversations = mongoose.model("Conversations", ConversationsSchema);

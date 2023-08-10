"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversations = exports.chatRooms = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const ChatRoomSchema = new Schema({
    chatId: { type: String, required: true },
    productId: { type: String, default: null },
    accessId: { type: String, default: null },
    productName: { type: String, default: null },
    requestId: { type: String, default: null },
    messageTitle: { type: String, default: null },
    isGroupChat: { type: Boolean, required: false, default: false },
    groupName: { type: String, default: null },
    /** participants contains the Id of all the persons involve in a chat */
    participants: [],
    participantsName: {},
    useRequestId: { type: Boolean, default: false },
    conversations: { type: Schema.Types.ObjectId, required: true, ref: "Conversations" },
    isActive: { type: Boolean, required: false, default: true }
}, {
    timestamps: true
});
const ConversationsSchema = new Schema({
    chatId: { type: String, required: true },
    conversation: [
        {
            message: { type: String, required: true },
            messageId: { type: String, required: true },
            messageType: { type: String, default: 'text' },
            senderId: { type: String, required: true },
            senderRole: { type: String, required: false },
            senderAvatar: { type: String, required: false },
            senderName: { type: String, default: "" },
            isRead: { type: Boolean, required: false, default: false },
            timeCreated: { type: String, required: true }
        }
    ]
}, {
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
ChatRoomSchema.plugin(mongoose_paginate_v2_1.default);
ConversationsSchema.plugin(mongoose_paginate_v2_1.default);
exports.chatRooms = mongoose_1.default.model("ChatRooms", ChatRoomSchema);
exports.conversations = mongoose_1.default.model("Conversations", ConversationsSchema);

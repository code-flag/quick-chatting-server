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
    roomId: { type: String, required: true },
    userOneId: { type: String, required: true },
    userTwoId: { type: String, required: true },
    userOneRole: { type: String, required: true },
    userTwoRole: { type: String, required: true },
    userOneName: { type: String, required: true },
    userTwoName: { type: String, required: true },
    userOneAvatar: { type: String, default: null },
    userTwoAvatar: { type: String, default: null },
    productId: { type: String, default: null },
    accessId: { type: String, default: null },
    productName: { type: String, default: null },
    conversationId: { type: Schema.Types.ObjectId, required: true, ref: "ChatRooms" },
    isActive: { type: Boolean, required: false, default: true }
});
const ConversationsSchema = new Schema({
    roomId: { type: String, required: true },
    conversation: {
        message: { type: String, required: true },
        messageType: { type: String, default: 'text' },
        senderId: { type: String, required: true },
        timeCreated: { type: Date, required: true }
    }
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

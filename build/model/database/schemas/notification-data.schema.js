"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushNotificationID = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const PushNotificationID = new Schema({
    userId: { type: String, required: true },
    firebaseNotificationToken: { type: String, required: true }
}, {
    timestamps: true
});
PushNotificationID.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.__v;
    },
});
PushNotificationID.plugin(mongoose_paginate_v2_1.default);
exports.pushNotificationID = mongoose_1.default.model("PushNotificationID", PushNotificationID);

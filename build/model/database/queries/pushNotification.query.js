"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationToken = exports.getNotificationToken = exports.createNotificationToken = exports.isNotificationIdExisting = void 0;
const notification_data_schema_1 = require("../schemas/notification-data.schema");
const isNotificationIdExisting = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationToken = yield notification_data_schema_1.pushNotificationID.findOne({ userId: userId });
    console.log('notificationToken', notificationToken);
    return notificationToken;
});
exports.isNotificationIdExisting = isNotificationIdExisting;
const createNotificationToken = (userId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationToken = yield notification_data_schema_1.pushNotificationID.create({ userId: userId, firebaseNotificationToken: token });
    return notificationToken;
});
exports.createNotificationToken = createNotificationToken;
/** Used to get a specific NotificationToken conversations */
const getNotificationToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationToken = yield notification_data_schema_1.pushNotificationID.findOne({ userId: userId });
    return notificationToken === null || notificationToken === void 0 ? void 0 : notificationToken.firebaseNotificationToken;
});
exports.getNotificationToken = getNotificationToken;
const updateNotificationToken = (userId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const dbResponse = yield notification_data_schema_1.pushNotificationID.findOne({ userId: userId });
    if (!dbResponse) {
        const notificationToken = yield notification_data_schema_1.pushNotificationID.create({ userId: userId, firebaseNotificationToken: token });
        return notificationToken;
    }
    else {
        if (dbResponse.firebaseNotificationToken !== token) {
            return yield notification_data_schema_1.pushNotificationID.updateOne({ userId: userId }, { firebaseNotificationToken: token });
        }
    }
});
exports.updateNotificationToken = updateNotificationToken;

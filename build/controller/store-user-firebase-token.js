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
exports.storeUserFirebaseToken = void 0;
const pushNotification_query_1 = require("../model/database/queries/pushNotification.query");
const storeUserFirebaseToken = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { firebaseNotificationToken, userId } = request.body;
    console.log("user firebaseNotificationToken, userId", firebaseNotificationToken, userId);
    let data;
    if (userId && firebaseNotificationToken) {
        const dbResponse = yield (0, pushNotification_query_1.updateNotificationToken)(userId, firebaseNotificationToken);
        data = dbResponse;
        // console.log("dbResponse", dbResponse); 
    }
    response.status(200).json({
        message: "success",
        // data: data
    });
});
exports.storeUserFirebaseToken = storeUserFirebaseToken;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const debug_1 = __importDefault(require("debug"));
const DEBUG = (0, debug_1.default)("dev");
function sendPushNotification(title, msg, token, data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data != undefined) {
            data["click_action"] = "FLUTTER_NOTIFICATION_CLICK";
            data["timestamp"] = new Date().toLocaleString();
        }
        else {
            data = { "click_action": "FLUTTER_NOTIFICATION_CLICK", timestamp: new Date().toLocaleString() };
        }
        const message = {
            data: data,
            notification: {
                title: title,
                body: msg
            },
            token: token,
        };
        firebase_admin_1.default
            .messaging()
            .send(message)
            .then((response) => {
            DEBUG(`Notification sent: ${response}`);
        })
            .catch((error) => {
            DEBUG(`Error sending notification: ${error}`);
        });
    });
}
exports.sendPushNotification = sendPushNotification;

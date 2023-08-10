"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueId = void 0;
const crypto_1 = __importDefault(require("crypto"));
const uniqueId = (num = 16) => {
    const id = crypto_1.default.randomBytes(num).toString("hex");
    return id;
};
exports.uniqueId = uniqueId;

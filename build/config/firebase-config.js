"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.firebaseConfig = {
    databaseURL: process.env.FIREBASEDB_URL
};

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const { engine } = require("express-handlebars");
// const express = require("express");
const express_1 = __importDefault(require("express"));
const path = require('path');
// const expressHbs = require("express-handlebars");
const expressHbs = __importStar(require("express-handlebars"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const options_1 = require("./config/options");
const routes_resident_1 = __importDefault(require("./controller/client-controller/routes.resident"));
const routes_staff_1 = __importDefault(require("./controller/client-controller/routes.staff"));
const store_user_notification_id_1 = __importDefault(require("./routes/store-user-notification-id"));
const create_chat_1 = require("./controller/create-chat");
const connection_1 = require("./config/connection");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebase_config_1 = require("./config/firebase-config");
const firebase_param_1 = require("./config/firebase-param");
var app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
// instatiating template engine
app.engine(".hbs", expressHbs.engine({ defaultLayout: 'main', extname: ".hbs" }));
app.set("views", path.join(__dirname, "./public/views"));
app.set("view engine", ".hbs");
// var hbs = expressHbs.create({});
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, Object.assign({}, options_1.serverOptions));
const PORT = process.env.PORT || 3200;
const host = process.env.HOST || "http://localhost";
/** ________________________Database connection_________________________ */
(0, connection_1.DBConnection)();
const serviceAccount = firebase_param_1.firebaseAccountCredentials;
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    databaseURL: firebase_config_1.firebaseConfig.databaseURL
});
/**
 * Handles all user socket events
 */
const chatSocket = io.of("/chat");
chatSocket.on("connection", (socket) => {
    (0, create_chat_1.chatController)(chatSocket, socket);
});
/**_________________________________ Middleware ________________________________ */
// header preflight configuration to prevent cors error
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    credentials: false,
}));
// Body Parser middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// make folders visible
app.use(express_1.default.static(path.join(__dirname, 'public')));
/** _______________________________API ROUTES_________________________________ */
app.use("/", routes_staff_1.default);
app.use("/staff", routes_staff_1.default);
app.use("/messenger", store_user_notification_id_1.default);
app.use("/resident", routes_resident_1.default);
// app.listen(PORT || 3000, () => {
//   console.log("server started on port", PORT);
// });
server.listen(PORT || 3200, () => {
    console.log(`Mesenger Server is running on ${host}:${PORT}`);
});

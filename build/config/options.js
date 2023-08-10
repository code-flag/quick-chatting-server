"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverOptions = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Contains all the server options for our application. This options wil be pass on to
 * The new `Server(options) constructor` to define our server `properties and behaviour
 *
 * @example
 * ```ts
 * const io = new Server(server, {
 *  ...serverOptions
 * });
 * ```
 * @see {@link server.ts for usage}
 */
exports.serverOptions = {
    cors: {
        // origin: "http://localhost:4000",
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    }
};

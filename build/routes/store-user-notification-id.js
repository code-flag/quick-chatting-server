"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_user_firebase_token_1 = require("../controller/store-user-firebase-token");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/user-notification-token", store_user_firebase_token_1.storeUserFirebaseToken);
exports.default = router;

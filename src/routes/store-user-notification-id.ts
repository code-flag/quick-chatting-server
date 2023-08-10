import { storeUserFirebaseToken } from "../controller/store-user-firebase-token";
import { Router } from "express";
const router = Router();

router.post(
  "/user-notification-token",
    storeUserFirebaseToken
);

export default router;





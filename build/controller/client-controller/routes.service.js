"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// const { initData } = require("./mediator.controller");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    // const data = await initData();
    res.render('service-chat', { vendorsData: '' });
});
router.get("/:userType", (req, res) => {
    // const data = await initData();
    console.log('service type', req.params.userType);
    res.render('service-chat', { vendorsData: '' });
});
exports.default = router;

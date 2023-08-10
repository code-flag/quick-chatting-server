import express from "express";
// const { initData } = require("./mediator.controller");
const router = express.Router();

router.get("/",(req:any, res: any) => {
    // const data = await initData();
    res.render('staff-chat', {vendorsData: ''});
});

router.get("/user/:userType",(req:any, res: any) => {
    // const data = await initData();
    console.log('service type', req.params.userType);
    
    res.render('staff-chat', {vendorsData: ''});
});

export default router;
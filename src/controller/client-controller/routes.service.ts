import express from "express";
// const { initData } = require("./mediator.controller");
const router = express.Router();

router.get("/",(req:any, res: any) => {
    // const data = await initData();
    res.render('service-chat', {vendorsData: ''});
});

router.get("/:userType",(req:any, res: any) => {
    // const data = await initData();
    console.log('service type', req.params.userType);
    
    res.render('service-chat', {vendorsData: ''});
});

export default router;
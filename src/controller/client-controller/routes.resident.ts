import express from "express";
// const { initData } = require("./mediator.controller");
const router = express.Router();

/**
 * This method check if a string is hex color code or not
 * @param color - hex color code
 * @returns - true or false
 */
const isHexColor = (color: string) => {
    console.log('test', typeof color === 'string'
        && (color.length === 6 || color.length === 3)
        && !isNaN(Number('0x' + color)));

    return typeof color === 'string'
        && (color.length === 6 || color.length === 3)
        && !isNaN(Number('0x' + color));
}

/**
 * This method check if a string is hex color code or not: this is not efficient as isHexCode method
 * @param color - hex color code
 * @returns - true or false
 */
const isValidColor = (color: string) => {
    color = '#' + color;
    console.log('color test 2', /^#[0-9A-F]{6}$/i.test(color));
    console.log('color test 3', /^#([0-9A-F]{3}){1, 2}$/i.test(color));
    return /^#[0-9A-F]{6}$/i.test(color);
}

router.get("/", (req: any, res: any) => {
    // const data = await initData();
    console.log('resident query', req.query.meta);

    req.query.appColor = isHexColor(req.query.appColor) ? req.query.appColor : '000';
    req.query.appBgColor = isHexColor(req.query.appBgColor) ? req.query.appBgColor : '33ccff';
    req.query.messengerName = req.query.messengerName && req.query.messengerName != '' ? req.query.messengerName : 'CPAAT Messenger';

    /**
     *  const appData = JSON.parse(JSON.stringify(req.query.appData));
    console.log('resident query',appData, appData.userType);
    
    appData.appColor = isHexColor(appData.appColor) ? appData.appColor : '000';
    appData.appBgColor = isHexColor(appData.appBgColor) ? appData.appBgColor : '33ccff';
    appData.messengerName = appData.messengerName && appData.messengerName != '' ? appData.messengerName : 'CPAAT Messenger';

     */
    const appInitData = {
        appName: req.query.messengerName,
        userType: req.query.userType,
        receiverId: req.query.receiverId,
        chatPage: req.query.chatPage,
        meta: req.query.meta
    }
    res.render('resident-chat', { appInitData: appInitData, appName: req.query.messengerName,
        appColor: req.query.appColor , appBgColor: req.query.appBgColor });
});

router.get("/:userType", (req: any, res: any) => {
    // const data = await initData();
    console.log('resident type', req.params.userType, req.params.appColor, req.params.messengerName);

    res.render('resident-chat', { vendorsData: '' });
});

export default router;
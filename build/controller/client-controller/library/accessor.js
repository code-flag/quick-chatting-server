"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyData = void 0;
/**
 * Returns key data if exist in Object else return null
 * @param {object} data - data object to check for key data
 * @param {string} key - key to look for
 */
const getKeyData = (data, key) => {
    console.log('data', data);
    if (data !== null && data !== undefined) {
        console.log('data key', Object.keys(data));
        let objKeys = Object.keys(data);
        if (objKeys.includes(key)) {
            return data[key];
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
};
exports.getKeyData = getKeyData;

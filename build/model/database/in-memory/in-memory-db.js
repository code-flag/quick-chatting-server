"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenToExpireData = exports.getStorageKeys = exports.deleteData = exports.getAndDeleteData = exports.hasKey = exports.getMultiData = exports.getData = exports.saveData = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
// const initMemoryCache = require('node-cache');
const inMemory = new node_cache_1.default();
/**
 *
 * @param {string} key - storage key for the data
 * @param {any} data - data to be saved in the storage
 * @param {number} time - expected duration of data in the storage in sec before its permanently deleted
 * @returns - boolean - true if successfull and false if failed
 */
const saveData = (key, data, time = 10000) => {
    return inMemory.set(key, data, time);
};
exports.saveData = saveData;
/**
 * Returns storage key data
 * @param {string} key - the storage key to retrieve data
 * @returns any
 */
const getData = (key) => {
    const d = inMemory.get(key);
    console.log("get data res", d);
    return d;
};
exports.getData = getData;
/**
 * This method gets multiple keys data together
 * @param {array} keyArray - array of all the keys to retreive thei value together
 * @returns array of object
 */
const getMultiData = (keyArray) => {
    return inMemory.mget(keyArray);
};
exports.getMultiData = getMultiData;
/**
 * Check if key exist in storage or not
 * @param {string} key - storage key
 * @returns boolean - true if it exist and false if not
 */
const hasKey = (key) => {
    return inMemory.has(key);
};
exports.hasKey = hasKey;
/**
 * Return the key data and then delete it from the storage
 * @param {string} key - storage key
 * @returns any
 */
const getAndDeleteData = (key) => {
    return inMemory.take(key);
};
exports.getAndDeleteData = getAndDeleteData;
/**
 * Delete data and the key from the storage
 * @param {string | array} key - storage key
 * @returns number of deleted keys
 */
const deleteData = (key) => {
    return inMemory.del(key);
};
exports.deleteData = deleteData;
const getStorageKeys = () => {
    return inMemory.keys();
};
exports.getStorageKeys = getStorageKeys;
const listenToExpireData = () => {
    inMemory.on("expired", function (key, value) {
        // ... do something ...
    });
};
exports.listenToExpireData = listenToExpireData;

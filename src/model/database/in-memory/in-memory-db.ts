import initMemoryCache from "node-cache";
// const initMemoryCache = require('node-cache');

const inMemory = new initMemoryCache();

/**
 * 
 * @param {string} key - storage key for the data
 * @param {any} data - data to be saved in the storage
 * @param {number} time - expected duration of data in the storage in sec before its permanently deleted
 * @returns - boolean - true if successfull and false if failed
 */
export const saveData = (key: any, data: any, time = 10000) => {
    return inMemory.set( key, data, time );
}

/**
 * Returns storage key data
 * @param {string} key - the storage key to retrieve data
 * @returns any
 */
export const getData = (key: string) => {
    const d = inMemory.get(key);
    console.log("get data res", d);
    return d;
}


/**
 * This method gets multiple keys data together
 * @param {array} keyArray - array of all the keys to retreive thei value together
 * @returns array of object
 */
export const getMultiData = (keyArray: Array<any>) => {
    return inMemory.mget(keyArray);
}


/**
 * Check if key exist in storage or not
 * @param {string} key - storage key
 * @returns boolean - true if it exist and false if not
 */
export const hasKey = (key: string) => {
    return inMemory.has(key);
}

/**
 * Return the key data and then delete it from the storage
 * @param {string} key - storage key
 * @returns any
 */
export const getAndDeleteData = (key: string) => {
    return inMemory.take(key);
}

/**
 * Delete data and the key from the storage
 * @param {string | array} key - storage key
 * @returns number of deleted keys
 */
export const deleteData = (key: string) => {
    return inMemory.del(key);
}

export const getStorageKeys = () => {
    return inMemory.keys();
}

export const listenToExpireData = () => {
    inMemory.on( "expired", function( key, value ){
        // ... do something ...
    });
}

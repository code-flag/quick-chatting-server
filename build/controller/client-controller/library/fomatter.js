"use strict";
/**
 * @author - Francis Olawumi Awe <awefrancolaz@gmail.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItemFromArray = exports.removeDuplicates = exports.isObjectKey = exports.camelCaseToUnderscore = exports.camelCaseTokebabCase = void 0;
/**
 * This function helps in converting camel case to kebabcase
 * @param {string} str - the string value in camel case to be converted to kebab case
 * @returns {string} - the formatted kebabcase value
 */
const camelCaseTokebabCase = (str) => {
    return str
        .split("")
        .map((letter, idx) => {
        return letter.toUpperCase() === letter
            ? `${idx !== 0 ? "-" : ""}${letter === null || letter === void 0 ? void 0 : letter.toLowerCase()}`
            : letter;
    })
        .join("");
};
exports.camelCaseTokebabCase = camelCaseTokebabCase;
/**
 * This function helps in converting camel case to underscore
 * @param {string} str - the string value in camel case to be converted to underscore
 * @returns {string} - the formatted underscore value
 */
const camelCaseToUnderscore = (str) => {
    return str
        .split("")
        .map((letter, idx) => {
        return letter.toUpperCase() === letter
            ? `${idx !== 0 ? "_" : ""}${letter === null || letter === void 0 ? void 0 : letter.toLowerCase()}`
            : letter;
    })
        .join("");
};
exports.camelCaseToUnderscore = camelCaseToUnderscore;
const isObjectKey = (obj, key) => {
    if (typeof obj == "object") {
        // check for payee key
        if (Object.keys(obj).includes(key)) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        console.log("Argument is not a valid object or object of objects", obj, "search key", key);
        return false;
    }
};
exports.isObjectKey = isObjectKey;
/**
 * This method remove duplicate elements from array
 * @param {array} arr - array data
 * @returns array - new array
 */
const removeDuplicates = (arr) => {
    if (Array.isArray(arr) && arr.length > 0) {
        // remove any duplicate element from array
        const newArr = [...new Set(arr)];
        return newArr;
    }
    else {
        return [];
    }
};
exports.removeDuplicates = removeDuplicates;
/**
 *
 * @param {array} arrayData - data
 * @param {any} item - item to delete from array
 * @returns array | null if element not found in array
 */
const removeItemFromArray = (arrayData, item) => {
    // console.log('incoming array', arrayData, 'item', item);
    arrayData = (0, exports.removeDuplicates)(arrayData);
    // console.log('formatted array', arrayData, 'item', item);
    const index = arrayData.indexOf(item);
    // console.log('array index', index);
    // only splice array when item is found
    if (index > -1) {
        arrayData.splice(index, 1); // 2nd parameter means remove one item only
        // console.log('new arr', arrayData);
        return arrayData;
    }
    else {
        return null;
    }
};
exports.removeItemFromArray = removeItemFromArray;

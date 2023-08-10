"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVendors = exports.getAllVendors = exports.getVendorsFiles = exports.readFile = exports.saveOrder = exports.updateVendorFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// join path of the directory
const directoryPath = path_1.default.join(__dirname, "../../vendors");
//save others to file if need be
const updateVendorFile = (data, fileName) => {
    return new Promise((resolve, reject) => {
        const stringifyData = JSON.stringify(data);
        try {
            fs_1.default.writeFileSync(directoryPath + "/" + fileName, stringifyData);
        }
        catch (error) {
            console.log('write error', error);
        }
    });
};
exports.updateVendorFile = updateVendorFile;
//save others to file if need be
const saveOrder = (data) => {
    const stringifyData = JSON.stringify(data);
    fs_1.default.writeFileSync("users.json", stringifyData);
};
exports.saveOrder = saveOrder;
//read the user data from json file
const readFile = (dir) => {
    const jsonData = fs_1.default.readFileSync(dir);
    const dataJSON = jsonData.toString();
    return JSON.parse(dataJSON);
};
exports.readFile = readFile;
const getVendorsFiles = () => {
    // console.log('directory path', directoryPath);
    let vendorsFilesArray = [];
    return new Promise((resolve, reject) => {
        fs_1.default.readdir(directoryPath, (err, vendorsFiles) => {
            // handling error
            if (err) {
                console.log("Unable to scan directory: " + err);
                return null;
            }
            else {
                //   console.log("vendors file dir", vendorsFiles);
                vendorsFiles.forEach((currentFile) => {
                    // get Current file path
                    const filePath = path_1.default.resolve(directoryPath, currentFile);
                    // get information about the file
                    fs_1.default.stat(filePath, (err, stat) => {
                        if (err)
                            throw err;
                        // check if the current path is file or folder
                        const isFile = stat.isFile();
                        if (isFile) {
                            vendorsFilesArray.push({ file: currentFile, path: filePath });
                        }
                    });
                });
                // allow the files to complete processing before returning data
                setTimeout(() => {
                    resolve(vendorsFilesArray);
                }, 1000);
            }
        });
    });
};
exports.getVendorsFiles = getVendorsFiles;
const getAllVendors = (vendorsFiles) => {
    let vendors = {};
    let vendorsList = {};
    let vendorsFileName = {};
    return new Promise((resolve, reject) => {
        //  check if vendorsFiles is not null
        if (Array.isArray(vendorsFiles) && vendorsFiles.length > 0) {
            vendorsFiles.forEach((currentFile) => {
                // get current file extention first to know if the extention matches the need one. Else jump the file
                const fileExtention = path_1.default.parse(currentFile.file).ext;
                if (fileExtention == ".json") {
                    // get current file name
                    const name = path_1.default.parse(currentFile.file).name;
                    vendors[(0, exports.readFile)(currentFile.path).name] = (0, exports.readFile)(currentFile.path);
                    vendorsFileName[(0, exports.readFile)(currentFile.path).name] = name;
                }
            });
            setTimeout(() => {
                resolve({ vendorsData: vendors, vendorsStorageFileName: vendorsFileName });
            }, 500);
        }
    });
};
exports.getAllVendors = getAllVendors;
/**
 * Return array of object containing all the vendors files data
 * @returns Array
 */
const getVendors = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, exports.getVendorsFiles)();
    if (data !== null) {
        // console.log("vendors data", data);
        return yield (0, exports.getAllVendors)(data);
    }
});
exports.getVendors = getVendors;

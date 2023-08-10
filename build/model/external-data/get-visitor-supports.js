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
exports.getVisitorSupportTeam = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * @param supportTeamGroup - name of the group that should be attending to the website new visitor or guest chat
 *
 * This method retrieve the support group staff member id so as to use it
 * to create a group chat with the new guest chat. This is done to ensure all the member of the support group
 * gets the message.
 * @returns Array of team id's
 * */
const getVisitorSupportTeam = (supportTeamGroup = 'Marketing') => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const endPoint = "https://development-api.gate-house.com/cpaat-data/group/staff/" + supportTeamGroup;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MDVjN2IxN2RiMDE3MTU0NTJkMDY5YyIsImVtYWlsIjoib2x1d2F0b3lpbi5rb21vbGFmZUBjcGFhdC1jb25zdWx0aW5nLmNvbSIsImlzQ3BhYXRBZG1pbiI6dHJ1ZSwiaWF0IjoxNjg1NjE5Mzk3LCJleHAiOjE2ODgyMTEzOTd9.plZ7NdKzU6EbFHZV5D7dUG9RkOlKoowizA1bY3gDHYQ";
    const team = yield axios_1.default.get(`${endPoint}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    let supportTeam = [];
    try {
        if (((_a = team === null || team === void 0 ? void 0 : team.data) === null || _a === void 0 ? void 0 : _a.data.length) !== 0) {
            team.data.data.forEach((team) => {
                supportTeam.push(team._id);
            });
            return supportTeam;
        }
    }
    catch (error) {
        console.log("error message:", error === null || error === void 0 ? void 0 : error.message);
        return [];
    }
});
exports.getVisitorSupportTeam = getVisitorSupportTeam;

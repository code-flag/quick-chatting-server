import { config } from "dotenv";
config();
export const firebaseConfig: any = {
    databaseURL: process.env.FIREBASEDB_URL
}
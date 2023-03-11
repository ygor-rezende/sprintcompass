import { config } from "dotenv";
config();
export const dbURL = process.env.DBURL;
export const dbDescription = process.env.DB;
export const projectCollection = process.env.PROJECTOLLECTION;
export const port = process.env.PORT;

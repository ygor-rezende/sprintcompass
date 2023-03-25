import { config } from "dotenv";
config();
export const dbURL = process.env.DBURL;
export const dbDescription = process.env.DB;
export const projectCollection = process.env.PROJECTOLLECTION;
export const backlogCollection = process.env.BACKLOGCOLLECTION;
export const port = process.env.PORT;
export const teamCollection = process.env.TEAMCOLLECTION;

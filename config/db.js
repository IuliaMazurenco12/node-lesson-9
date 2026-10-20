import { Sequelize } from "sequelize";
import config from "./config.js";

const { database, username, password, ...options } = config.development;

export const sequelize = new Sequelize(database, username, password, options);
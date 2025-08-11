import winston from "winston";
import configs from "./config";
import { ENVIRONMENT, LOG_LEVEL } from "../constants/environment";

const logLevel = configs.env === ENVIRONMENT.PRODUCTION ? LOG_LEVEL.INFO : LOG_LEVEL.DEBUG

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.json(),
  defaultMeta: { service: configs.appName },
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

export default logger;
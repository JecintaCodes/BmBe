"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mainApp_1 = require("./mainApp");
const db_1 = require("./config/db");
dotenv_1.default.config();
const realPort = parseFloat(process.env.PORTNUMBER);
const port = realPort;
const app = (0, express_1.default)();
(0, mainApp_1.mainApp)(app);
const server = app.listen(port, () => {
    console.log("");
    (0, db_1.boundM)();
    console.log("");
    console.log(`server is listening to port ${port}... 🌠🌠🌠`);
    console.log("");
});
process.on("uncaughtException", (error) => {
    console.log(`server is shutting down due to uncaughtException: ${error}`);
    process.exit(1);
});
process.on("unhandledRejection", (error) => {
    console.log(`server is shutting down due to unhandledRejection: ${error}`);
    server.close(() => {
        process.exit(1);
    });
});

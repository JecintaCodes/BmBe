"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const productRouter_1 = __importDefault(require("./router/productRouter"));
const paymentRouter_1 = __importDefault(require("./router/paymentRouter"));
const mainApp = (app) => {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        next();
    });
    // app.use(cors({ origin: ["*"] }));
    (0, cors_1.default)({
        origin: [
            "*",
            "http://localhost:5173",
            "http://localhost:4000",
            "https://boundary-market.web.app",
        ],
    });
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)("dev"));
    app.use((0, helmet_1.default)());
    app.use("/api/v1", userRouter_1.default);
    app.use("/api/v1", productRouter_1.default);
    app.use("/api/v1", paymentRouter_1.default);
    app.get("/", (req, res) => {
        try {
            return res.status(200).json({
                message: "Api live ..............",
            });
        }
        catch (error) {
            return res.status(404).json({
                message: "server error",
                data: error,
            });
        }
    });
};
exports.mainApp = mainApp;

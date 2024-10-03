import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRouter from "./router/userRouter";
import productRouter from "./router/productRouter";
import paymentRouter from "./router/paymentRouter";

export const mainApp = (app: Application) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
  // app.use(cors({ origin: ["*"] }));
  cors({
    origin: [
      "*",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4000",
      "https://boundary-market.web.app/",
    ],
  });
  app.use(express.json());

  app.use(morgan("dev"));
  app.use(helmet());

  app.use("/api/v1", userRouter);
  app.use("/api/v1", productRouter);
  app.use("/api/v1", paymentRouter);

  app.get("/", (req: Request, res: Response) => {
    try {
      return res.status(200).json({
        message: "Api live ..............",
      });
    } catch (error) {
      return res.status(404).json({
        message: "server error",
        data: error,
      });
    }
  });
};

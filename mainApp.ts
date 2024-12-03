import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import session from "express-session";
// import cookieParser from "cookie-parser";
// import ServerlessHttp from "serverless-http";
// import { iUserData } from "./model/userMode";
// import passport from "passport";
// import "./utils/strategies/localStrategy";
import userRouter from "./router/userRouter";
import productRouter from "./router/productRouter";
import paymentRouter from "./router/paymentRouter";
import servicesRouter from "./router/servicesRouter";
import categoryRouter from "./router/categoryModel";

export const mainApp = (app: Application) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header(
      "Access-Control-Allow-Origin",
      "https://boundary-market1.web.app"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
  // app.use(cors({ origin: ["*"] }));
  // cors({
  //   origin: [
  //     "*",
  //     "http://localhost:5173/",
  //     "http://localhost:4000/",
  //     "https://boundary-market1.web.app",
  //   ],
  // });
  // app.use(
  //   cors({
  //     origin: [
  //       "*",
  //       "http://localhost:5173/",
  //       "http://localhost:4000/",
  //       "https://boundary-market1.web.app",
  //     ],
  //     methods: ["GET", "POST", "PATCH", "DELETE"],
  //     // allowedHeaders: ["Content-Type", "Authorization"],
  //     // exposedHeaders: ["Authorization"],
  //     // credentials: true,
  //   })
  // );
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  });
  // app.use(
  //   cors({
  //     origin: ["http://localhost:5173/"], // Allow specific origin
  //     methods: ["GET", "POST", "PUT", "DELETE"],
  //     allowedHeaders: ["Content-Type", "Authorization"],
  //     credentials: true,
  //   })
  // );
  app.use(cors());
  app.use(express.json());

  app.use(morgan("dev"));
  app.use(helmet());
  // app.use(cookieParser("boundarymarketPlatform"));

  app.set("trust proxy", 1);
  // app.use(
  //   session({
  //     secret: "boundarymarketPlatform",
  //     resave: false,
  //     saveUninitialized: true,
  //     cookie: { secure: false, maxAge: 3600 },
  //   })
  // );

  app.use("/api/v1", userRouter);
  app.use("/api/v1", productRouter);
  app.use("/api/v1", paymentRouter);
  app.use("/api/v1", servicesRouter);
  app.use("/api/v1", categoryRouter);

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

  // // PASSPORT LOGIN
  // app.post(
  //   "/api/login",
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     passport.authenticate(
  //       "local",
  //       (err: any, user: iUserData, info: string) => {
  //         if (err)
  //           return res.status(404).json({ message: err.message, status: 404 });
  //         if (!user)
  //           return res.status(404).json({ message: info, status: 404 });

  //         return res.status(201).json({
  //           message: "Logged in successfully!",
  //           data: user,
  //           status: 201,
  //         });
  //       }
  //     )(req, res, next);
  //   }
  // );

  // // BACKUP-PASSPORT LOGIN
  // app.post(
  //   "/api/login/start",
  //   passport.authenticate("local"),
  //   function (req: Request, res: Response, next: NextFunction) {
  //     // console.log(req.session);
  //     // console.log(req.user);

  //     return res.status(200).json({
  //       message: "Logged in successfully!",
  //       data: req.user,
  //     });
  //   }
  // );
};

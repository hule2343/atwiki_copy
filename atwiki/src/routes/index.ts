import express from "express";
import userRouter from "./crud/user.js";
import logRouter from "./crud/log.js";
import authRouter from "./auth/auth.js";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import cors from "cors";
import passport from "passport";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.urlencoded({ extended: true }), express.json());

app.use(
  session({
    name: "session",
    secret: "kantendo",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 1, sameSite: "lax" }, // 1 day expiration
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use("", authRouter);
app.use("/users", userRouter);
app.use("/logs", logRouter);

app.listen(3001);
import express from "express";
import userRouter from "./routes/crud/user.js";
import logRouter from "./routes/crud/log.js";
import authRouter from "./routes/auth/auth.js";
import session from "express-session";
import cors from "cors";
import passport from "./routes/auth/passport.js";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
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
    name: "sessionId",
    secret: "kantendo",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 1, sameSite: "lax" }, // 1 day expiration
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "connect-src": ["'self'", "https://discord.com"],
        "base-uri": ["'self'"],
        "block-all-mixed-content": [],
        "font-src": ["'self'", "https:", "data:"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'self'"],
        "object-src": ["'none'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
        "upgrade-insecure-requests": [],
      },
    },
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use("", authRouter);
app.use("/users", userRouter);
app.use("/logs", logRouter);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(3001);

import argon2id from "argon2";
import { Router, Request, Response } from "express";
import passport, { isLoggedIn } from "./passport.js";
import { PrismaClient } from "@prisma/client";
import joi from "joi";

const prisma = new PrismaClient();
const authRouter = Router();
const ClientURL = "http://localhost:3000";

authRouter.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("Login succeed");
  res.json(req.user);
});

authRouter.get("/login/fail", (req: Request, res: Response) => {
  res.status(401).json({ message: "login was failured" });
});

authRouter.post("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      res.status(401);
    }
  });
  res.redirect("/is_login");
});

authRouter.post("/register", async (req: Request, res: Response) => {
  const { error } = registerSchema.validate(req.body);

  if (error) return res.status(400).json({ error: error.details });

  await prisma.user
    .create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: await argon2id.hash(req.body.password),
        phonenumber: req.body.phonenumber,
        is_student: req.body.is_student,
      },
    })
    .then((_user) => {
      res.redirect(ClientURL);
    })
    .catch((error) => res.status(409).json({ error: error }));
});

authRouter.get("/is_login", (req, res) => {
  console.log("/logout", req.isAuthenticated());
  console.log("is_login called", req.user);
  res.json({ is_login: req.isAuthenticated() });
});

const registerSchema = joi.object().keys({
  name: joi.string().trim().required(),
  email: joi.string().trim().email().required(),
  password: joi.string().min(6).required(),
  phonenumber: joi.string().allow(""),
  is_student: joi.boolean().default(false),
});

export default authRouter;

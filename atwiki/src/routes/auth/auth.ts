import argon2id from "argon2";
import { Router, Request, Response } from "express";
import passport from "./passport.js";
import { PrismaClient } from "@prisma/client";
import { isLoggedIn } from "./passport";
import joi from "joi";

const prisma = new PrismaClient();
const authRouter = Router();

authRouter.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "",
  })
);

authRouter.get("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      res.status(401);
    }
  });
  res.redirect("/");
});

authRouter.post("/register", async (req: Request, res: Response) => {
  const { error } = registerSchema.validate(req.body);

  if (error) return res.status(400).json({ error: error.details[0] });

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
      res.redirect("/login");
    })
    .catch(() => res.status(400).json("Unable to add user"));
});

const registerSchema = joi.object().keys({
  name: joi.string().trim().required(),
  email: joi.string().trim().email().required(),
  password: joi.string().min(6).required(),
  phonenumber: joi.string(),
  is_student: joi.boolean().default(false),
});

export default authRouter;

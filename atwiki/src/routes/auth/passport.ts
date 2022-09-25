import { PrismaClient } from "@prisma/client";
import argon2id from "argon2";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  phonenumber: string;
  task: string;
  absent: string;
  is_student: boolean;
};

const prisma = new PrismaClient();

passport.serializeUser((user: Express.User, done: any) => {
  console.log("serialized", user);
  done(null, (user as User).id);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },

    async (username: string, password: string, done: any) => {
      const user = await prisma.user.findUnique({
        where: { name: username },
      });
      console.log("LocalStrategy");

      console.log(user);

      const response = "invalid login credentials";

      if (!user) return done(response);
      else if (user) {
        const passMatch = await argon2id.verify(user.password, password);

        if (passMatch) {
          console.log("pass Matched", user);
          return done(null, user);
        }

        return done(response);
      }
    }
  )
);

passport.deserializeUser(async function (id: number, done: any) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(id),
      },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();

  res.status(401).redirect("/login");
};

export default passport;

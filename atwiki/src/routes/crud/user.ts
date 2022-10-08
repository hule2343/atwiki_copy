import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany();

  res.json(users);
});

userRouter.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  res.json(user);
});

userRouter.post("/user", async (req, res) => {
  const { name, email, password, phonenumber, is_student } = req.body;

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
      phonenumber: phonenumber,
      task: null,
      absent: null,
      is_student: is_student,
    },
  });

  res.json({ user });
});

userRouter.patch("/:id/", async (req, res) => {
  const { id } = req.params;

  const { name, email, phonenumber, task, date, is_student } = req.body;

  const user = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name: name != null ? name : undefined,
      email: email != null ? email : undefined,
      phonenumber: phonenumber != null ? phonenumber : undefined,
      task: task != null ? task : undefined,
      absent: date != null ? date : undefined,
      is_student: is_student != null ? is_student : undefined,
    },
  });

  res.json({ user });
});

export default userRouter;

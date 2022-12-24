import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import joi from "joi";
const prisma = new PrismaClient();

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany();

  res.status(200).json(users);
});

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  res.status(200).json(user);
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

  res.status(200).json(user);
});

userRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details });
  const { name, email, phonenumber, task, date, is_student } = req.body;

  prisma.user
    .update({
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
    })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
});

const updateSchema = joi.object().keys({
  name: joi.string().trim().allow(""),
  email: joi.string().trim().email().allow(""),
  password: joi.string().min(6).allow(""),
  phonenumber: joi.string().allow(""),
  task: joi.string().allow(""),
  absent: joi.string().allow(""),
  is_student: joi.boolean().allow(""),
});

export default userRouter;

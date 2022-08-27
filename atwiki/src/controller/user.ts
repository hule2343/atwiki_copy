import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();

  res.json({ users });
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });

  res.json(user);
});

app.post("/user", async (req, res) => {
  const { name, email, phonenumber, is_student } = req.body;

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      phonenumber: phonenumber,
      task: null,
      absent: null,
      is_student: is_student,
    },
  });

  res.json({ user });
});

app.patch("/users/:id/", async (req, res) => {
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

import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";

const prisma = new PrismaClient();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();

  res.json(users);
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

app.get("/logs", async (req, res) => {
  const logs = await prisma.log.findMany();

  res.json(logs);
});

app.get("/log/:id", async (req, res) => {
  const { id } = req.params;

  const log = await prisma.log.findFirst({
    where: {
      id: Number(id),
    },
  });

  res.json(log);
});

app.post("/log", async (req, res) => {
  const { date, url, title } = req.body;

  const log = await prisma.log.create({
    data: {
      date: date,
      url: url,
      title: title,
    },
  });

  res.json({ log });
});

app.listen(3001);

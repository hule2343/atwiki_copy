import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.get("/logs", async (req, res) => {
  const logs = prisma.log.findMany();

  res.json({ logs });
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

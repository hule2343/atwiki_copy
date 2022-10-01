import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const logRouter = Router();

logRouter.get("/", async (req, res) => {
  const logs = await prisma.log.findMany();

  res.json(logs);
});

logRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const log = await prisma.log.findFirst({
    where: {
      id: Number(id),
    },
  });

  res.json(log);
});

logRouter.post("/log", async (req, res) => {
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

export default logRouter;

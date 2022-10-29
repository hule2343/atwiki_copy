import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import * as fs from "fs";

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
  const { date, title } = req.body;

  try {
    fs.appendFileSync("log.txt", `${date} ${title}\n`);
    res.send();
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

export default logRouter;

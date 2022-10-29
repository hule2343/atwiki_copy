import { Router } from "express";
import * as fs from "fs";

const logRouter = Router();

type Log = {
  id: number;
  date: string;
  title: string;
};

logRouter.get("/", async (req, res) => {
  await fs.readFile("log.txt", "utf-8", (err, text) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    const logList = text.split("\n");
    const logLength = logList.length - 1; //最後の空行を含まない
    const logJsonList: Log[] = [];
    for (let i = 1; i <= 10; i++) {
      if (logLength - i < 0) {
        break;
      } else {
        const date = logList[logLength - i].split(" ", 1)[0];
        logJsonList.push({
          id: i,
          date: date.replace("_", " "),
          title: logList[logLength - i].split(date + " ")[1],
        });
      }
    }
    res.send(logJsonList);
  });
});

logRouter.post("/log", async (req, res) => {
  const { date, title } = req.body;

  await fs.appendFile("log.txt", `${date} ${title}\n`, (err) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.send();
  });
});

export default logRouter;

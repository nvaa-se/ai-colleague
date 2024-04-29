import * as dotenv from "dotenv";
dotenv.config(); // keep this line first in file

import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import db from "./services/db";
import discord from "./services/discord";
import { answerReply, handleCommandSamtal, handleReply } from "./queues";
import * as workers from "./workers";

// start workers
Object.values(workers).forEach((worker) => worker.run());

// start ui
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(handleCommandSamtal),
    new BullMQAdapter(handleReply),
    new BullMQAdapter(answerReply),
  ],
  serverAdapter: serverAdapter,
  options: {
    uiConfig: {
      boardTitle: "AI-kollegan",
    },
  },
});

const app = express();
discord.login();

app.use("/admin/queues", serverAdapter.getRouter());
const port = process.env.PORT || 3000;
db.init().then(async () => {
  app.listen(port, () => {
    console.log(`Running on ${port}...`);
    console.log(`For the UI, open http://localhost:${port}/admin/queues`);
  });
}) ;
app.get("/", (req, res) => {
  res.send(`Hej! Jag är din nya AI-kollega!`);
});

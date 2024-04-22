import dotenv from "dotenv";
dotenv.config(); // keep this line first in file

import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import db from "./services/db";

import discord from "./services/discord";
// keep this line, otherwise the workers won't be started
import * as workers from "./workers";
import {
  discordReview,
  downloadPDF,
  getCustomer,
  indexParagraphs,
  parseText,
  reflectOnAnswer,
  searchVectors,
  splitText,
  userFeedback,
} from "./queues";
import companyRoutes from "./routes/companyRoutes";

// start workers
Object.values(workers).forEach((worker) => worker.run());

// start ui
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(getCustomer),
    new BullMQAdapter(downloadPDF),
    new BullMQAdapter(splitText),
    new BullMQAdapter(indexParagraphs),
    new BullMQAdapter(searchVectors),
    new BullMQAdapter(parseText),
    new BullMQAdapter(reflectOnAnswer),
    new BullMQAdapter(discordReview),
    new BullMQAdapter(userFeedback),
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

app.use("/api", companyRoutes);
app.use("/admin/queues", serverAdapter.getRouter());
const port = process.env.PORT || 3000;
db.init().then(async () => {
  // const anomaly = await db.deviations.find((elem) => (
  //   elem.strAvvikelsetext === "Ej Utställt"
  // ));
  app.listen(port, () => {
    console.log(`Running on ${port}...`);
    console.log(`For the UI, open http://localhost:${port}/admin/queues`);
    // console.log(
    //   "Deviations with Avvikelsetext === 'Ej Utställt",
    //   JSON.stringify(
    //     anomaly,
    //     null,
    //     2
    //   )
    // );
  });
}) ;
app.get("/", (req, res) => {
  res.send(`Hej! Jag är din nya AI-kollega!`);
});

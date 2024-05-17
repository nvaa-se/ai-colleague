import * as dotenv from 'dotenv'
dotenv.config() // keep this line first in file

import express from 'express'
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'
import discord from './services/discord'
import {
  handleCommandSamtal,
  handleReply,
  summarizeAsk,
  planAnswer,
  dataFetcher,
  answerQuestion,
} from './queues'
import * as workers from './workers'
import { runQuery } from './services/dbAccess'

// start workers
Object.values(workers).forEach((worker) => worker.run())

// start ui
const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')

createBullBoard({
  queues: [
    new BullMQAdapter(handleCommandSamtal),
    new BullMQAdapter(handleReply),
    new BullMQAdapter(summarizeAsk),
    new BullMQAdapter(planAnswer),
    new BullMQAdapter(dataFetcher),
    new BullMQAdapter(answerQuestion),
  ],
  serverAdapter: serverAdapter,
  options: {
    uiConfig: {
      boardTitle: 'AI-kollegan',
    },
  },
})

const app = express()
discord.login()

app.use('/admin/queues', serverAdapter.getRouter())
const port = process.env.PORT || 3000
runQuery('SELECT 1')
  .then(() => {
    console.log('Connected to DB')
    app.listen(port, () => {
      console.log(`Running on ${port}...`)
      console.log(`For the UI, open http://localhost:${port}/admin/queues`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err)
  })

app.get('/', (req, res) => {
  res.send(`Hej! Jag är din nya AI-kollega!`)
})

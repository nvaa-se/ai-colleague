import { Worker, Job } from 'bullmq'
import redis from '../config/redis'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import {
  addReplyToThread,
  addThread,
  getFacilityByStrAnlNr,
} from '../services/dbAccess'

class JobData extends Job {
  data: {
    strAnlNr: string
    channelId: string
    messageId: string
  }
}

const worker = new Worker(
  'handleCommandSamtal',
  async (job: JobData) => {
    const { strAnlNr, channelId, messageId } = job.data
    job.log(`Getting based on strAnlNr: ${strAnlNr}`)
    const channel = (await discord.channel(channelId)) as TextChannel
    const message = await channel?.messages?.fetch(messageId)
    if (message) await message.edit(`Söker efter telefonummer...`)

    try {
      const possibleCustomers = await getFacilityByStrAnlNr(strAnlNr)
      if (possibleCustomers.length === 0) {
        message.edit(
          `Ingen anläggning hittades med anläggningsnummer (${strAnlNr})`
        )
      } else if (possibleCustomers.length === 1) {
        const initialResponse = `1 anläggning hittades med anläggningsnummer (${strAnlNr})`
        message.edit(initialResponse)
        // const fullCustomerInfo = await getFullCustomerInfo(possibleCustomers[0].intRecnum)
        const threadStart = new Date()
          .toLocaleString('sv-SE', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
          .replace(',', '')
        const name = `${threadStart} — ${possibleCustomers[0].strFastBeteckningHel}`
        let thread = await channel.threads.create({
          name: name,
          autoArchiveDuration: 1440,
          startMessage: messageId,
        })
        if (!thread.id) {
          thread = await channel.threads.create({
            name: name,
            autoArchiveDuration: 1440,
            startMessage: messageId,
          })
        }
        console.log(
          `Thread called '${name}' created: '${thread.id} with message '${messageId}`
        )
        await thread.sendTyping()
        const reply = `Kundens namn: \`${possibleCustomers[0].strKundNamnHel}\`
Adress: \`${possibleCustomers[0].strAnlAdressHel}\`
Fastighetsbeteckning: \`${possibleCustomers[0].strFastBeteckningHel}\`
KundNummer: \`${possibleCustomers[0].intKundnr}\`
Anläggningsnummer: \`${possibleCustomers[0].strAnlnr}\``

        await addThread(thread.id, possibleCustomers[0].strAnlnr)
        await addReplyToThread(thread.id, reply)
        const res = await thread.send(reply)
      } else {
        let msg = `${possibleCustomers.length} anläggningar hittades`
        possibleCustomers.forEach((facility, index) => {
          msg += `\n${index + 1}. ${facility.strKundNamnHel} på ${
            facility.strAnlAdressHel
          }, ${facility.strFastBeteckningHel}`
        })
        message.edit(msg)
      }

      // return value can be accessed from a series of workers chained in a flow. Send the relevant output data that can be used in the next step or null until we use the data.
      return 'fake text' // TODO: WHAT TO RETURN HERE?
    } catch (error) {
      if (message)
        await message.edit(
          `Fel vid kundsökning med telefonnummer(${strAnlNr}): ${error.message} ${error.stack}`
        )
      job.log(
        `Fel vid kundsökning med telefonnummer(${strAnlNr}): ${error.message} ${error.stack}`
      )
      throw error
    }
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker

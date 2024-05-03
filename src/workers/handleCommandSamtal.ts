import { Worker, Job } from 'bullmq'
import redis from '../config/redis'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import {
  addReplyToThread,
  addThread,
  getFacilityByPhone,
  getFullCustomerInfo,
} from '../services/dbAccess'

class JobData extends Job {
  data: {
    phoneNumber: string
    channelId: string
    messageId: string
  }
}

const worker = new Worker(
  'handleCommandSamtal',
  async (job: JobData) => {
    const { phoneNumber, channelId, messageId } = job.data
    job.log(`Getting based on phoneNumber: ${phoneNumber}`)
    const channel = (await discord.channel(channelId)) as TextChannel
    const message = await channel?.messages?.fetch(messageId)
    if (message) await message.edit(`Söker efter telefonummer...`)

    try {
      const possibleCustomers = await getFacilityByPhone(phoneNumber)
      if (possibleCustomers.length === 0) {
        message.edit(
          `Ingen anläggning hittades med telefonnummer(${phoneNumber})`
        )
      } else if (possibleCustomers.length === 1) {
        message.edit(`1 anläggning hittades med telefonnummer(${phoneNumber})`)

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
        const thread = await channel.threads.create({
          name: name,
          autoArchiveDuration: 1440,
          startMessage: messageId,
        })
        console.log(
          `Thread called '${name}' created: '${thread.id} with message '${messageId}`
        )
        await thread.sendTyping()
        const reply = `Kundens namn: \`${possibleCustomers[0].strKundNamnHel}\`
Adress: \`${possibleCustomers[0].strAnlAdressHel}\`
Fastighetsbeteckning: \`${possibleCustomers[0].strFastBeteckningHel}\`
KundNummer: \`${possibleCustomers[0].intKundnr}\`
Anläggningsnummer: \`${possibleCustomers[0].strAnlnr}\``

        await addThread(thread.id, possibleCustomers[0].intRecnum)
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
          `Fel vid kundsökning med telefonnummer(${phoneNumber}): ${error.message}`
        )
      job.log(
        `Fel vid kundsökning med telefonnummer(${phoneNumber}): ${error.message}`
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

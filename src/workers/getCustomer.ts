import { Worker, Job } from 'bullmq'
import redis from '../config/redis'
import { splitText } from '../queues'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import db from '../services/db'
import { getFacilityByPhone, getFullCustomerInfo } from '../services/dbAccess'

// import elastic from '../elastic'

class JobData extends Job {
  data: {
    phoneNumber: string
    channelId: string
    messageId: string
  }
}

const jsonStringifyBigIntToString = (key, value) => {
  if(typeof value === 'bigint') {
    return value.toString()
  } else {
    return value
  }
}


const worker = new Worker(
  'getCustomer',
  async (job: JobData) => {
    const { phoneNumber, channelId, messageId } = job.data
    job.log(`Getting based on phoneNumber: ${phoneNumber}`);
    const channel = (await discord.client.channels.fetch(
      channelId
    )) as TextChannel
    const message = await channel?.messages?.fetch(messageId)
    if (message) await message.edit(`Söker efter telefonummer...`)

    try {
      const possibleCustomers = await getFacilityByPhone(phoneNumber);
      if (possibleCustomers.length === 0) {
        message.edit(`Ingen anläggning hittades med telefonnummer(${phoneNumber})`)
      } else if (possibleCustomers.length === 1) {
        message.edit(`1 anläggning hittades med telefonnummer(${phoneNumber}):
        ${possibleCustomers[0].strKundNamnHel} på ${possibleCustomers[0].strAnlAdressHel}, ${possibleCustomers[0].strFastBeteckningHel}`)
        const fullCustomerInfo = await getFullCustomerInfo(possibleCustomers[0].intRecnum)
        console.log(
          JSON.stringify(fullCustomerInfo, jsonStringifyBigIntToString, 4)
        );
      } else {
        let msg = `${possibleCustomers.length} anläggningar hittades`
        possibleCustomers.forEach((facility, index) => {
          msg += `\n${index + 1}. ${facility.strKundNamnHel} på ${facility.strAnlAdressHel}, ${facility.strFastBeteckningHel}`
        })
        message.edit(msg)
      }
      // if (message) await message.edit(`Tolkar PDF...`)
      // const buffer = await response.arrayBuffer()
      // let doc
      // try {
      //   doc = await pdf(buffer)
      // } catch (error) {
      //   if (message)
      //     await message.edit(`Fel vid tolkning av PDF: ${error.message}`)
      //   job.log(`Error parsing PDF: ${error.message}`)
      //   throw error
      // }
      // const text = doc.text
      // if (message)
      //   await message.edit(
      //     `Hittade ${text.length} tecken. Delar upp i sidor...`
      //   )

      // let pdfHash = ''
      // try {
      //   // pdfHash = await elastic.hashPdf(Buffer.from(buffer))
      //   pdfHash = "fakeHash"
      // } catch (error) {
      //   job.log(`Error indexing PDF: ${error.message}`)
      // }

      // splitText.add('split text ' + text.slice(0, 20), {
      //   url,
      //   text,
      //   channelId,
      //   messageId,
      //   pdfHash,
      // })

      // return doc.text
      return 'fake text'
    } catch (error) {
      if (message)
        await message.edit(`Fel vid kundsökning med telefonnummer(${phoneNumber}): ${error.message}`)
      job.log(`Fel vid kundsökning med telefonnummer(${phoneNumber}): ${error.message}`)
      throw error
    }
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker

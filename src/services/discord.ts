import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  TextChannel,
  ModalBuilder,
  ButtonBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ModalActionRowComponentBuilder,
  TextInputStyle,
  Embed,
  EmbedBuilder,
  ThreadChannel,
} from 'discord.js'
import commands from '../commands'
import config from '../config/discord'
import { EventEmitter } from 'events'
import { handleReply } from '../queues'

const discordIntents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
]
export class Discord extends EventEmitter {
  client: Client<boolean>
  rest: REST
  commands: Array<any>
  token: string
  channelId: string

  constructor({ token, guildId, clientId, channelId }) {
    super()
    this.token = token
    this.channelId = channelId

    this.client = new Client({ intents: discordIntents })
    this.rest = new REST().setToken(token)
    this.commands = commands.map((command) => command.data.toJSON())
    this.client.on('ready', () => {
      console.log('discord connected')
      const url = Routes.applicationGuildCommands(clientId, guildId)
      this.rest.put(url, { body: this.commands })
    })
    this.client.on('messageCreate', async (message) => {
      try {
        console.log('messageCreate', message.channel.isThread())
        if (message.channel.isThread()) {
          const threadStart = await message.channel.fetchStarterMessage()
          if (
            message.author.id !== config.botUserId &&
            threadStart.author.id === config.botUserId
          ) {
            console.log('handling reply')
            handleReply.add('handleReply', {
              threadChannelId: message?.channel?.id,
              reply: message.content,
            })
          } else {
            console.log('wrong author, thread or whatever')
          }
        }
      } catch (error) {
        console.error('Error in messageCreate:', error)
      }
    })
    this.client.on('interactionCreate', async (interaction) => {
      if (interaction.isCommand()) {
        const command = commands.find(
          (command) => command.data.name === interaction.commandName
        )
        try {
          await command.execute(interaction)
        } catch (error) {
          console.error('Discord error:', error)
          await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          })
        }
        // } else if (interaction.isButton()) {
        //   let reportState = ''

        //   const [action, documentId] = interaction.customId.split('_')
        //   switch (action) {
        //     case 'approve':
        //       this.emit('approve', documentId)
        //       reportState = 'approved'
        //       interaction.update({
        //         embeds: [
        //           new EmbedBuilder()
        //             .setTitle(`Godkänd (reportId: ${documentId})`)
        //             .setDescription(
        //               `Tack för din granskning, ${interaction?.user?.username}!`
        //             ),
        //         ],
        //         components: [],
        //       })
        //       break
        //     case 'edit':
        //       reportState = 'edited'
        //       const input = new TextInputBuilder()
        //         .setCustomId('editInput')
        //         .setLabel(`Granska utsläppsdata`)
        //         .setStyle(TextInputStyle.Paragraph)

        //       const actionRow =
        //         new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        //           input
        //         )

        //       const modal = new ModalBuilder()
        //         .setCustomId('editModal')
        //         .setTitle(`Granska data för...`) // ${parsedJson.companyName}`)
        //         .addComponents(actionRow)
        //       // todo diskutera hur detta görs på bästa sätt för mänskliga granskaren. vad är alex input?

        //       await interaction.showModal(modal)

        //       const submitted = await interaction
        //         .awaitModalSubmit({
        //           time: 60000 * 20, // user has to submit the modal within 20 minutes
        //           filter: (i) => i.user.id === interaction.user.id, // only user who clicked button can interact with modal
        //         })
        //         .catch((error) => {
        //           console.error(error)
        //           return null
        //         })

        //       if (submitted) {
        //         const userInput = submitted.fields.getTextInputValue('editInput')
        //         //this.emit('edit', documentId, userInput)

        //         await submitted.reply({
        //           content: `Tack för din feedback: \n ${userInput}`,
        //         })
        //         await userFeedback.add('userFeedback', {
        //           documentId,
        //           messageId: '',
        //           channelId,
        //           feedback: userInput,
        //         })
        //       }
        //       break
        //     case 'reject':
        //       reportState = 'rejected'
        //       this.emit('reject', documentId)
        //       interaction.update({
        //         content: 'Rejected!',
        //         embeds: [],
        //         components: [],
        //       })
        //       break
        //   }
        //   if (reportState !== '') {
        //     try {
        //       // await elastic.updateDocumentState(documentId, reportState)
        //     } catch (error) {
        //       //job.log(`Error updating document state: ${error.message}`)
        //     }
        //   }
      } else {
        console.log('interaction:')
      }
    })
  }

  login(token = this.token) {
    this.client.login(token)
    return this
  }
  async channel(channelId) {
    return await this.client.channels.fetch(channelId)
  }

  async sendMessageToChannel(channelId, message) {
    try {
      const channel = await this.client.channels.fetch(channelId)
      if (!channel || !(channel instanceof TextChannel)) {
        console.error(`Kanalen hittades inte eller är inte en textkanal.`)
        return
      }
      await channel.send(message)
    } catch (error) {
      console.error('Ett fel uppstod när meddelandet skulle skickas:', error)
    }
  }
}

export default new Discord(config)

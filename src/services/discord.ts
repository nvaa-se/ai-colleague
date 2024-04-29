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
import commands from '../discord/commands'
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

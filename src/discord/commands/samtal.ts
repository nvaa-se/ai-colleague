import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'
import { handleCommandSamtal } from '../../queues'
import { parsePhoneNumber } from 'libphonenumber-js'

export default {
  data: new SlashCommandBuilder()
    .setName('samtal')
    .addStringOption((option) =>
      option
        .setName('anläggningsnummer')
        .setDescription('inkommande ringare')
        .setRequired(true)
    )
    .setDescription(
      'Skicka in kundens anläggningsnummer och få tillbaka en bra kundbild.'
    ),

  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const strAnlNr = interaction.options.getString('anläggningsnummer')
    console.log('samtal', strAnlNr)

    /*    if (!telefonnummer) {
      await interaction.reply({
        content:
          "Telefonnummer saknas. Försök igen med /samtal <telefonnummer>",
        ephemeral: true,
      });

      return;
    }

    let phoneNumber = parsePhoneNumber(telefonnummer, "SE");
    if (!phoneNumber.isValid()) {
      await interaction.reply({
        content: `Telefonnumret (${telefonnummer}) är inte giltigt. Försök igen med /samtal <telefonnummer>`,
        ephemeral: true,
      });

      return;
    }
    const formattedPhoneNumber = phoneNumber
      .formatInternational()
      .replace(/[\s-]/g, "");
*/
    const reply = await interaction.reply({
      content: `Tack! Snart kommer det information om din inringare (${strAnlNr}).`,
      fetchReply: true,
    })
    const channelId = interaction.channelId
    const messageId = reply.id

    handleCommandSamtal.add('handleCommandSamtal ' + strAnlNr, {
      strAnlNr,
      channelId,
      messageId,
    })
  },
}

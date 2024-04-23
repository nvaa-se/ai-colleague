import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { handleCall } from '../queues'
import { parsePhoneNumber } from "libphonenumber-js";

export default {
  data: new SlashCommandBuilder()
    .setName("samtal")
    .addStringOption((option) =>
      option
        .setName("telefonnummer")
        .setDescription("inkommande ringare")
        .setRequired(true)
    )
    .setDescription(
      "Skicka in kundens telefonnummer och få tillbaka en bra kundbild."
    ),

  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    console.log("samtal");
    const telefonnummer = interaction.options.getString("telefonnummer");
    if (!telefonnummer) {
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
        content: `Telefonnummret (${telefonnummer}) är inte giltigt. Försök igen med /samtal <telefonnummer>`,
        ephemeral: true,
      });

      return;
    }
    const formattedPhoneNumber = phoneNumber
      .formatInternational()
      .replace(/[\s-]/g, "");

    const reply = await interaction.reply({
      content: `Tack! Snart kommer det information om din inringare (${formattedPhoneNumber}).`,
      fetchReply: true,
    });
    const channelId = interaction.channelId;
    const messageId = reply.id;

    handleCall.add("handleCall " + formattedPhoneNumber, {
      phoneNumber: formattedPhoneNumber,
      channelId,
      messageId,
    });
  },
};
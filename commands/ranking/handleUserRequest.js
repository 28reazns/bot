const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Locale, } = require('discord.js');
const noblox = require("../../noblox.js")
const { guildId, rbxcookie, rbxtoken } = require('../../config.json');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('handlerequest')
        .setDescription('Handle a given users join request.')
        .addUserOption(
            (option) =>
                option.setName("user")
                    .setDescription("User to rank.")
                    .setRequired(true)
        )
        .addBooleanOption(
            (option) =>
                option.setName("acceptdeny")
                    .setDescription("Accept (true), Deny(false)")
                    .setRequired(true)
        )
    ,
    async execute(client, interaction) {
        const interactor = interaction.member
        let msg = "Failed to accept user.";
        const user = interaction.options.getUser("user");
        const bool = interaction.options.getBoolean("acceptdeny")

        if (interactor) {
            if (interactor.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                let rblxId = await noblox.verifyUser(user?.id)
                if (rblxId) {
                    let success = await noblox.acceptUser(rblxId, bool)
                    
                    if (success === 1) {
                        //console.log("Accepted User")
                        let username = await noblox.getUsernameFromId(rblxId)

                        const embed = new EmbedBuilder()
                            .setColor("#ff4ab4")
                            .addFields(
                                { name: 'Accepted!', value: `${username} //${rblxId} (<@!${user.id}>) has been accepted into the ROBLOX group.`, inline: true },
                            )
                            .setTimestamp()
                            .setFooter({ text: 'Bot coded by <@!505158312224882722> // ukechainsaw on ROBLOX.' });

                        msg = { embeds: [embed] }
                    } else if (success === 0) {
                        //console.log("User is Member")
                        msg = "User is already a member!"
                    } else if (success === -1) {
                        //console.log("Failure")
                        msg = "Failed to accept user."
                    }
                }

                await interaction.reply(msg)
            }
        }


    }


}
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Locale, } = require('discord.js');
const noblox = require("../../noblox.js")
const { guildId, rbxcookie, rbxtoken } = require('../../config.json');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shout')
        .setDescription('Shout a given message.')
        .addStringOption(
            (option) =>
                option.setName("message")
                    .setDescription("Message to shout.")
                    .setRequired(true)
        )
    ,
    async execute(client, interaction) {
        const interactor = interaction.member
        let msg = "Failed to post shout.";
        const strng = interaction.options.getString("message")

        if (interactor) {
            if (interactor.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                
                let success = await noblox.shoutMessage(strng)
                const info = await noblox.getGroupInfo()
                if(success){
                    const embed = new EmbedBuilder()
                            .setColor("#ff4ab4")
                            .setTitle(`Successfully posted shout!`)
                            .setURL('https://www.roblox.com/groups/'+info.id)
                            .setDescription(`**Content**:\n${strng}`)
                            .setThumbnail(info.icon)
                            .setTimestamp()
                            .setFooter({ text: 'Bot coded by <@!505158312224882722> // ukechainsaw on ROBLOX.' });
                    msg = { embeds: [embed] }
                }else{
                    msg = "Failed to post shout."
                }

                await interaction.reply(msg)
            }
        }


    }


}
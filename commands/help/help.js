const fs = require('node:fs');
const path = require('node:path');

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Locale, } = require('discord.js');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get info for each commands'),
    async execute(client, interaction) {
        const interactor = interaction.member

        if (interactor) {
            const embed = new EmbedBuilder()
                .setColor("#ff4ab4")
                .setAuthor({ name: "Command Help" })

            const foldersPath = path.join(__dirname, "..")
            const commandFolders = fs.readdirSync(foldersPath);

            for (const folder of commandFolders) {
                const commandsPath = path.join(foldersPath, folder);
                //console.log(commandsPath)
                embed.addFields({name:folder.toUpperCase()+" COMMANDS",value:" "})
               // console.log("-".repeat(20))
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);
                    //console.log(filePath)
                    const command = require(filePath);
                    if ('data' in command && 'execute' in command) {
                        embed.addFields({name:"/"+command.data.name,value:command.data.description})
                    }
                }
                //console.log("\n")
            }

            embed.setTimestamp()
                .setFooter({ text: 'Bot coded by <@!505158312224882722> // ukechainsaw on ROBLOX.'});
            await interaction.reply({embeds:[embed]})
        }


    }
}
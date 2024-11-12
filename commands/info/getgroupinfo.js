const { SlashCommandBuilder,GuildChannelManager } = require('discord.js');
const axios = require('axios');
const noblox = require("../../noblox")
const rbxtoken = process.env.rbxtoken;
const { EmbedBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('groupinfo')
        .setDescription('Get group info.'),
    async execute(client,interaction) {

        //console.log(interaction)

        let msg = "Failed to get group data."
        try{
            const response =  await axios.get('https://apis.roblox.com/cloud/v2/groups/34735752', {
                headers: {'x-api-key':rbxtoken},
            })
            .catch(err =>{
                console.log("Error.")
                console.log(err.response.data)
                
            })
            if(response){
                //console.log(response.data)

                const info = await noblox.getGroupInfo()

                msg = "Successfully got group info."
                const embed = new EmbedBuilder()
                .setColor("#ff4ab4")
                .setTitle(info.name+" ("+info.id+")")
                .setURL('https://www.roblox.com/groups/'+info.id)
                .setAuthor({ name: 'ROBLOX Group Info'})
                .setDescription(info.desc)
                .setThumbnail(info.icon)
                .addFields(
                    { name: 'Public Joining Allowed?', value: ((info.publicEntry && "true")|| "false") },
                    { name: "Owner:", value: info.owner.username},
                    { name: "Members: ", value: ''+info.memberCount}
                )
                .setTimestamp()
                .setFooter({ text: 'Bot coded by <@!505158312224882722> // ukechainsaw on ROBLOX.'});

                msg = {embeds:[embed]}
            }
        }catch(error){
            console.log(error)
        }
        
        await interaction.reply(msg);
    }
};


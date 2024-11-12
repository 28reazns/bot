const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Locale, } = require('discord.js');
const axios = require('axios');
const noblox = require("../../noblox.js")
const { guildId, rbxcookie, rbxtoken } = require('../../config.json');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listrequests')
        .setDescription('List the groups join requests'),
    async execute(client, interaction) {
        const interactor = interaction.member
        let msg = "Failed to get requests.";
        let posted = false;

        if (interactor) {
            if (interactor.permissions.has(PermissionsBitField.Flags.ManageRoles)) {


                async function displayRequest(cursor,confirmation) {
                    let request = await noblox.listRequests(cursor);
                    let previous = null;
                    let next = null;

                    if (request) {
                        let list = " ";

                        previous = request.previousPageCursor
                        next = request.nextPageCursor
                        let length = -1
                        let users = {}

                        for (const idx in request.data) {
                            length += 1

                            const info = request.data[idx]

                            console.log(info.created)
                            let datenum = new Date(info.created).getTime().toString().slice(0, -3)
                            console.log(datenum)
                            list += `**User**: ${info.requester.username} (${info.requester.userId}) \n **Date Requested**: <t:${datenum}:R> \n \n`
                            users[idx] = info.requester.userId

                        }



                        const info = await noblox.getGroupInfo()

                        const embed = new EmbedBuilder()
                            .setColor("#ff4ab4")
                            .setTitle(`${info.name} - Join Requests`)
                            .setURL('https://www.roblox.com/' + info.id)
                            .setDescription(list)
                            .setThumbnail(info.icon)
                            .setTimestamp()
                            .setFooter({ text: 'Bot coded by <@!505158312224882722> // ukechainsaw on ROBLOX.' });



                        const lastbtn = new ButtonBuilder()
                            .setCustomId('last')
                            .setLabel('Last Page')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(previous == null)

                        const nextbtn = new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Next Page')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(next == null)
                        const acceptall = new ButtonBuilder()
                            .setCustomId('accept')
                            .setLabel('Accept all requests')
                            .setStyle(ButtonStyle.Success)
                        const denyall = new ButtonBuilder()
                            .setCustomId('deny')
                            .setLabel('Deny all requests')
                            .setStyle(ButtonStyle.Danger)

                        const row = new ActionRowBuilder()
                            .addComponents(lastbtn, nextbtn, acceptall, denyall)



                        msg = {
                            embeds: [embed],
                            components: [row],
                        }


                        if (posted && confirmation) {
                            await confirmation.update(msg)
                        }

                        return {previous,next,users}
                    }
                }

                let {previous,next,users} = await displayRequest()
                const interactionresponse = await interaction.reply(msg)
                if (interactionresponse) {
                    posted = true
                    const collectorFilter = i => i.user.id === interaction.user.id;

                    try {
                        const confirmation = await interactionresponse.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

                        if (confirmation.customId === 'last') {
                            await displayRequest(previous,confirmation)
                        } else if (confirmation.customId === 'next') {
                            await displayRequest(next,confirmation)
                        } else if (confirmation.customId === 'deny') {
                            noblox.acceptUsers(users, false)
                            let n = 0
                            for(const idx in users){
                                n+=1
                            }
                            await interaction.editReply({ content: `Denied ${m} Users.`, components: [], embeds: [] });
                        } else if (confirmation.customId === 'accept') {
                            noblox.acceptUsers(users, true)
                            let n = 0
                            for(const idx in users){
                                n+=1
                            }
                            await interaction.editReply({ content: `Accepted ${n} Users.`, components: [], embeds: [] });
                        }

                    } catch (err) {
                        if (posted) {
                            await interaction.editReply({ content: 'Unable to change page.', components: [], embeds: [] });
                        }
                        if(err){
                            console.log(err)
                        }
                    }


                }
            }else{
                msg = "Lacking **Manage Roles** permission. (Are you even a staff member!?)"
                await interaction.reply(msg)
            }
            
        }


    }
}
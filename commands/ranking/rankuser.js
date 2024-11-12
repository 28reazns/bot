const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const axios = require('axios');
const guildId = process.env.guildId
const noblox = require("../../noblox.js")
const rbxtoken = process.env.rbxtoken


module.exports = {
    data: new SlashCommandBuilder()
        .setName('rankuser')
        .setDescription('Rank a given Discord User in the ROBLOX Group.')
        .addUserOption(
            (option) =>
                option.setName("user")
                    .setDescription("User to rank.")
                    .setRequired(true)
        )
        .addStringOption(
            option =>
                option.setName("rank")
                    .setDescription("Rank name to rank user to.")
                    .setRequired(true)
        ),
    async execute(client, interaction) {
        const user = interaction.options.getUser("user");
        let guild = client.guilds.cache.find(g => g.id == guildId)
        const interactor = interaction.member
        const rankName = interaction.options.getString("rank");
        let msg = "Failed to rank user.";

        if (interactor) {
            if (interactor.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                let rblxId = await noblox.verifyUser(user?.id)
                if (rblxId) {
                    console.log(rblxId)
                    let pageToken = "";
                    let foundRole = false;
                    while (!foundRole) {
                        let resp1 = await axios.get(`https://apis.roblox.com/cloud/v2/groups/${34735752}/roles?maxPageSize=20&pageToken=${pageToken}`, { headers: { 'x-api-key': rbxtoken } })
                            .catch(err => {
                                console.log("Error Getting Group Roles.")
                                msg = "Role does not exist!"
                                console.log(err.response.data)
                                foundRole = true
                            })
                        if (resp1) {
                            pageToken = resp1.nextPageToken

                            for (const idx in resp1.data.groupRoles) {
                                if (!foundRole) {
                                    let role = resp1.data.groupRoles[idx]
                                    // console.log(role)
                                    if ((role.displayName == rankName) || (role.rank == "" + rankName)) {
                                        foundRole = true
                                        //console.log("ROLE: "+role.displayName)
                                        try {
                                            noblox.rankUser(rblxId, role.rank)



                                        } catch (err) {
                                            console.log("Error Ranking User:")
                                            console.log(err)
                                        } finally {
                                            let rankNum = await noblox.getUserRank(rblxId)
                                            if (rankNum <= 49) {
                                                msg = `Ranked User <@!${user.id}> to ${role.displayName}.`

                                                //console.log(client)


                                                let discordRole = guild.roles.cache.find(r => r.name == role.displayName);
                                                if (!discordRole) {
                                                    console.log("Role doesn't exist.")
                                                } else {
                                                    const member = guild.members.cache.find(m => m.id == user.id)
                                                    let lastrole = await noblox.getUserRole(rblxId);
                                                    if (member) {


                                                        let oldRole = guild.roles.cache.find(r => r.name == lastrole);

                                                        member.roles.remove(oldRole);
                                                        member.roles.add(discordRole);

                                                    }

                                                    //  console.log(lastrole)



                                                    const embed = new EmbedBuilder()
                                                        .setColor("#ff4ab4")
                                                        .addFields(
                                                            { name: 'Ranked Changed From: ', value: lastrole, inline: true },
                                                            { name: 'Ranked Changed To: ', value: role.displayName, inline: true }
                                                        )
                                                        .setTimestamp()
                                                        .setFooter({ text: 'Bot coded by <@!505158312224882722> // ukechainsaw on ROBLOX.' });

                                                        msg = { embeds: [embed] }

                                                }
                                            } else {
                                                msg = `Unable to Rank <@!${user.id}> to ${role.displayName}. They're a staff member!`
                                                let lastrole = await noblox.getUserRole(rblxId);

                                                const embed = new EmbedBuilder()
                                                    .setColor("#ff4ab4")
                                                    .addFields(
                                                        { name: 'Rank remains: ', value: lastrole, inline: true },
                                                    )
                                                    .setTimestamp()
                                                    .setFooter({ text: 'Bot coded by <@!505158312224882722> // ukechainsaw on ROBLOX.' });

                                                msg = { embeds: [embed] }
                                            }

                                        }



                                    }
                                }

                            }
                        }
                    }
                } else {
                    msg = "Failed to get user information."
                }
            } else {
                msg = "Lacking **Manage Roles** permission. (Are you even a staff member!?)"
            }
        }

        await interaction.reply(msg);
    }
};

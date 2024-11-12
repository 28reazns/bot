const noblox = require('noblox.js')
const axios = require('axios');
const rbxcookie = process.env.rbxcookie;
const bloxtoken = process.env.bloxtoken;
const guildId = process.env.guildId;
const groupId = 34735752
async function startApp () {
    // You MUST call setCookie() before using any authenticated methods [marked by 🔐]
    // Replace the parameter in setCookie() with your .ROBLOSECURITY cookie.
    const currentUser = await noblox.setCookie(rbxcookie) 
    //console.log(currentUser)
    console.log(`Logged in as ${currentUser.name} [${currentUser.id}]`)
}
startApp()

async function rankUser(userId,rank) {
    console.log("ranking ROBLOX user.")

    const rankNum = await noblox.getRankInGroup(groupId,userId)
    const rankName = await noblox.getRankNameInGroup(groupId,userId)

    rank = Number.parseInt(rank) || rank
    
    console.log((rankNum==rank)||(rankName==rank))


    if ((rankNum==rank)||(rankName==rank)){
        console.log("User has the same rank.")
    }else{
        try{
            if (rankNum < 49){
                noblox.setRank(groupId,userId,rank)
            }
        } catch(err){
            console.log(err)
        }
    }
}

async function getUserRank(userId) {
    const rankNum = await noblox.getRankInGroup(groupId,userId)
    return rankNum
}

function shoutMessage(message){
    try{
        noblox.shout(groupId, message)
    } catch(err){
        console.log(err)
    }
} 

async function acceptUser(userId,accept){
    const rank = await getUserRank(userId)==0
    //console.log(rank)
    if(rank==1){
        try{
            await noblox.handleJoinRequest(groupId,userId,accept)
            return 1
         } catch(err){
             console.log(err)
             return -1
         }
    }else{
        return 0
    }
}

async function verifyUser(userId) {
    const response = await axios.get(`https://api.blox.link/v4/public/guilds/${guildId}/discord-to-roblox/${userId}`, { headers: { "Authorization": bloxtoken } })
    .catch(err => {
        console.log("Error Verifying User.")
        msg = "Error Verifying User."
        console.log(err.response.data)
    })
    if (response){
        return response.data.robloxID;
    }
}

async function listRequests(cursor) {
    let request = await noblox.getJoinRequests(groupId, "Asc", 25,cursor)
    return request
}

async function acceptUsers(users,accept) {
    for(const idx in users){
        await acceptUser(users[idx],accept)
    }
}

async function getUserRole(userId){
    const role = await noblox.getRankNameInGroup(groupId,userId)
    //console.log(role)
    try{
        return role
    } catch(err){
        console.log(err)
        return null
    }
}

async function getGroupInfo(){
    let info = await noblox.getGroup(groupId)
    return {
        icon: await noblox.getLogo(groupId,"420x420",false),
        id: info.id,
        desc: info.description,
        memberCount: info.memberCount,
        publicEntry: info.publicEntryAllowed,
        name: info.name,
        owner: info.owner
    }
}

async function shoutMessage(message) {
    try{
        await noblox.shout(groupId,message)
        return true
    }catch(err){
        console.log(err)
        return false
    }
}

module.exports = {
    rankUser,
    shoutMessage,
    acceptUser,
    getUserRole,
    getUserRank,
    verifyUser,
    listRequests,
    getGroupInfo,
    acceptUsers,
    getUsernameFromId: noblox.getUsernameFromId,
    shoutMessage,
}
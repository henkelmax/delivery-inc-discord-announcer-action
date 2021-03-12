//@ts-check
const core = require('@actions/core');
const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs');

(async () => {
    try {
        const token = core.getInput('bot-token');
        const channelID = core.getInput('channel-id');
        const version = core.getInput('version');
        const changelogPath = core.getInput('changelog-path');

        core.setSecret(token);

        core.startGroup('Sending message');
        await connectAndSend(token, channelID, version, changelogPath ? fs.readFileSync(changelogPath) : '');
        core.endGroup();
    } catch (error) {
        core.setFailed(error.message);
    }
})();

function connectAndSend(token, channelID, version, changelog) {
    return new Promise((resolve, reject) => {
        const client = new Client();
        client.on('ready', async () => {
            console.log(`Logged in as ${client.user.tag}!`);
            const channel = await client.channels.fetch(channelID);
            await sendAnnouncement(channel, version, changelog);
            resolve();
        });
        client.login(token);
    });
}

async function sendAnnouncement(channel, version, changelog) {
    const message = new MessageEmbed()
        .setColor('#0099FF')
        .setTitle(`*Delivery Inc.* version **${version}** has just been released!`)
        .setAuthor('henkelmax', 'https://i.imgur.com/q5NSvAR.png', 'https://www.curseforge.com/members/henkelmax')
        .setDescription('Go download it now on [CurseForge](https://www.curseforge.com/minecraft/modpacks/delivery-inc)!')
        .setThumbnail('https://i.imgur.com/tFbwQTj.png')
        .addField('Changelog', changelog)
        .addField('\u200B', '\u200B')
        .addField('Want to discuss the modpack with other people?', '<#817726407852556299>')
        .addField('Want to give feedback?', '<#817727979034771487>')
        .addField('Having an issue?', 'Report a bug on the [GitHub Issue Tracker](https://github.com/henkelmax/delivery-inc/issues).')
        .setTimestamp()
        .setFooter(`Delivery Inc. ${version}`, 'https://i.imgur.com/tFbwQTj.png');

    await channel.send(message);
}
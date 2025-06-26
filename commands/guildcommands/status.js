const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const wait = require('node:timers/promises').setTimeout;

function abbreviateNumber(number, digits) {

    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (number >= si[i].value) {
            break;
        }
    }
    return (number / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Generates an Alliance overview'),
    async execute(interaction) {
        await interaction.deferReply();
        await wait(1_000);
        const embed = new EmbedBuilder()
            .setTitle('The Potentium Order')
            .setTimestamp()
        const allies = await fetch('http://swgoh.gg/api/guild-profile/pIc8G4IAQIqb6yhdJbZLLA/')
        const alliesData = await allies.json()
        let alliesCount = alliesData.data.member_count;
        let alliesGP = alliesData.data.galactic_power;
        embed.addFields({name: 'Allies of the Force', value: alliesCount + '/50 - ' + abbreviateNumber(alliesGP, 1) + ' GP'})

        const gray = await fetch('http://swgoh.gg/api/guild-profile/qI_Xd-ieQ96mlvaQ4ZFNUQ/')
        const grayData = await gray.json();
        let grayCount = grayData.data.member_count;
        let grayGP = grayData.data.galactic_power;
        embed.addFields( {name: "Child of Gray", value: grayCount + "/50 - " + abbreviateNumber(grayGP, 1) + " GP"})

        const light = await fetch('http://swgoh.gg/api/guild-profile/BUGhAu3zT2-QZXaCAaeTYQ/')
        const lightData = await light.json();
        let lightCount = lightData.data.member_count;
        let lightGP = lightData.data.galactic_power;
        embed.addFields({name: "Child of Light", value: lightCount + "/50 - " + abbreviateNumber(lightGP, 1) + " GP"})

        const masters = await fetch('http://swgoh.gg/api/guild-profile/nhcU8fWtTMKRFOnAl5Umnw/')
        const mastersData = await masters.json();
        let mastersCount = mastersData.data.member_count;
        let mastersGP = mastersData.data.galactic_power;
        embed.addFields({name: "Potentium Masters", value: mastersCount + "/50 - " + abbreviateNumber(mastersGP, 1) + " GP"})

        const padawans = await fetch('http://swgoh.gg/api/guild-profile/7CEc-w7GTu-96TBCbcPBVg/')
        const padawansData = await padawans.json();
        let padawansCount = padawansData.data.member_count;
        let padawansGP = padawansData.data.galactic_power;
        embed.addFields({name: "Potentium Padawans", value: padawansCount + "/50 - " + abbreviateNumber(padawansGP, 1) + " GP"})


        await interaction.editReply({ embeds: [embed] });
    },
};
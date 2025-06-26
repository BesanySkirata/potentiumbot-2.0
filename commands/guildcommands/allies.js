const { SlashCommandBuilder } = require('discord.js');
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
		.setName('allies')
		.setDescription('Lists out all members of Allies of the Force, their GP, fleet arena rank, and datacron counts'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		await wait(1_000);
		const embed = new EmbedBuilder()
			.setTitle('Allies Roster Data Part 1')
			.setTimestamp()
		const embedTwo = new EmbedBuilder()
			.setTitle('Allies Roster Data Part 2')
			.setTimestamp()
		const allies = await fetch('http://swgoh.gg/api/guild-profile/pIc8G4IAQIqb6yhdJbZLLA/')
        const alliesData = await allies.json()
		const alliesCount = alliesData.data.members.length
		let i = 0;
		for (i; i < 25; i++) {
			const alliesMCode = alliesData.data.members[i].ally_code
			const alliesMember = await fetch('https://swgoh.gg/api/player/' + alliesMCode + '/')
			const alliesMemberData = await alliesMember.json()
			const alliesMemberName = alliesMemberData.data.name
			const alliesMemberDatacrons = alliesMemberData.datacrons.length
			const alliesMemberFleet = alliesMemberData.data.fleet_arena.rank
			const alliesMemberGP = alliesMemberData.data.galactic_power

			embed.addFields({ name: alliesMemberName, value: '**GP**: ' + abbreviateNumber(alliesMemberGP, 1) + ' - **Fleet Arena Rank**: ' + alliesMemberFleet + " - **Datacron count**: " + alliesMemberDatacrons })

		}

		for (i = 25; i < alliesCount; i++)
		{
			const alliesMCode = alliesData.data.members[i].ally_code
			const alliesMember = await fetch('https://swgoh.gg/api/player/' + alliesMCode + '/')
			const alliesMemberData = await alliesMember.json()
			const alliesMemberName = alliesMemberData.data.name
			const alliesMemberDatacrons = alliesMemberData.datacrons.length
			const alliesMemberFleet = alliesMemberData.data.fleet_arena.rank
			const alliesMemberGP = alliesMemberData.data.galactic_power

			embedTwo.addFields({ name: alliesMemberName, value: '**GP**: ' + abbreviateNumber(alliesMemberGP, 1) + ' - **Fleet Arena Rank**: ' + alliesMemberFleet + " - **Datacron count**: " + alliesMemberDatacrons })
		};
        await interaction.editReply({ embeds: [embed, embedTwo] })
		//await interaction.editReply('It\'s not ready yet!');
	},
};

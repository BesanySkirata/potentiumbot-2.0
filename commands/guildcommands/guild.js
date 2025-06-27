//standard requirements for this to work at all
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js')
const wait = require('node:timers/promises').setTimeout;

//function to make numbers readable. pass the number and then how many decimal digits you want (used 1 here for GP, for example)
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

//build the command
module.exports = {
	data: new SlashCommandBuilder()
		.setName('guild')
		.setDescription('Enter an ally code to retrieve a guild\'s members, their GP, fleet arena rank, and datacron counts')
        .addIntegerOption(option =>
            option.setName('allycode')
                .setDescription('An ally code from the guild you\'re looking up')
                .setMaxValue(999999999)
                .setRequired(true)
        ),
    //on interaction
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true }); //hold the reply, ephemeral because this gets LARGE and it's better not to clog channels
		await wait(3_000); //wait a bit for things to parse, thanks loops
        const allycode = interaction.options.getInteger('allycode') //retrieve the passed ally code
		
        //a series of constants to get from ally code to guild ID
        const ally = await fetch ('https://swgoh.gg/api/player/' + allycode + '/')
        const allyID = await ally.json()
        const guildID = allyID.data.guild_id
		const guild = await fetch('https://swgoh.gg/api/guild-profile/' + guildID + '/')
        const guildData = await guild.json()
        //two constants to get data that isn't available in the player-specific API
		const guildCount = guildData.data.members.length
        const guildName = guildData.data.name
        //init the actual embeds assuming guild of 26+ players
        const embed = new EmbedBuilder()
			.setTitle(guildName + ' Roster Data Part 1')
			.setTimestamp()
		const embedTwo = new EmbedBuilder()
			.setTitle(guildName + ' Roster Data Part 2')
			.setTimestamp()
        //init loop variable
		let i = 0;
        //check to make sure the guild has enough members to require the second embed - discord has a maximum of 25 fields per embed, which is why this is necessary. 
        //I could use plain text here but... ehh. Embeds look cleaner and can be copy/paste'd out into a spreadsheet a bit easier, per testing
        if (26 <= guildCount <= 50){
        //loop to build the embed, part 1 - first 25 members
		for (i; i < 25; i++) {
			const guildMCode = guildData.data.members[i].ally_code
			const guildMember = await fetch('https://swgoh.gg/api/player/' + guildMCode + '/')
			const guildMemberData = await guildMember.json()
			const guildMemberName = guildMemberData.data.name //player name
			const guildMemberDatacrons = guildMemberData.datacrons.length //count of datacrons
			const guildMemberFleet = guildMemberData.data.fleet_arena.rank //fleet arena rank (crystal income)
			const guildMemberGP = guildMemberData.data.galactic_power //total GP
            //per player, build out an embed field with the info gathered above. this is the same for the remaining for loops, so I won't repeat the comments in each
			embed.addFields({ name: guildMemberName, value: '**GP**: ' + abbreviateNumber(guildMemberGP, 1) + ' - **Fleet Arena Rank**: ' + guildMemberFleet + " - **Datacron count**: " + guildMemberDatacrons })

		}
        //loop to build the embed, part 2 - any members beyond 25
        for (i = 25; i < guildCount; i++)
		{
			const guildMCode = guildData.data.members[i].ally_code
			const guildMember = await fetch('https://swgoh.gg/api/player/' + guildMCode + '/')
			const guildMemberData = await guildMember.json()
			const guildMemberName = guildMemberData.data.name
			const guildMemberDatacrons = guildMemberData.datacrons.length
			const guildMemberFleet = guildMemberData.data.fleet_arena.rank
			const guildMemberGP = guildMemberData.data.galactic_power

			embedTwo.addFields({ name: guildMemberName, value: '**GP**: ' + abbreviateNumber(guildMemberGP, 1) + ' - **Fleet Arena Rank**: ' + guildMemberFleet + " - **Datacron count**: " + guildMemberDatacrons })
		};
        //after building is complete, edit the reply to put the two embeds in. It might take a minute because loops.
        await interaction.editReply({ embeds: [embed, embedTwo] })
        }
        //for guilds with 25 or fewer members, rare as that may be for someone using this tool
        else{
            //update the title because "part 1" isn't necessary when there's 25 or fewer members
            embed.setTitle(guildName + ' Roster Data')
            //loop and build the new embed, of course
            for (i = 0; i < guildCount; i++)
		{
			const guildMCode = guildData.data.members[i].ally_code
			const guildMember = await fetch('https://swgoh.gg/api/player/' + guildMCode + '/')
			const guildMemberData = await guildMember.json()
			const guildMemberName = guildMemberData.data.name
			const guildMemberDatacrons = guildMemberData.datacrons.length
			const guildMemberFleet = guildMemberData.data.fleet_arena.rank
			const guildMemberGP = guildMemberData.data.galactic_power

			embed.addFields({ name: guildMemberName, value: '**GP**: ' + abbreviateNumber(guildMemberGP, 1) + ' - **Fleet Arena Rank**: ' + guildMemberFleet + " - **Datacron count**: " + guildMemberDatacrons })
		};
        //after building is complete, edit the reply to put the embed in. It might take a minute because loops.
        await interaction.editReply({ embeds: [embed] })
        }
	},
};

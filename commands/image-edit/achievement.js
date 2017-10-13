const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class AchievementCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'achievement',
			aliases: ['minecraft-achievement'],
			group: 'image-edit',
			memberName: 'achievement',
			description: 'Sends a Minecraft achievement with the text of your choice.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'text',
					prompt: 'What should the text of the achievement be?',
					type: 'string',
					validate: text => {
						if (text.length < 25) return true;
						return 'Invalid text, please keep the text under 25 characters.';
					}
				}
			]
		});
	}

	async run(msg, { text }) {
		try {
			const { body } = await snekfetch
				.get('https://www.minecraftskinstealer.com/achievement/a.php')
				.query({
					i: 1,
					h: 'Achievement Get!',
					t: text
				});
			return msg.say({ files: [{
				attachment: body,
				name: 'achievement.png'
			}] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};


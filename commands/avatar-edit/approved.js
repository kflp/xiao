const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class ApprovedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'approved',
			aliases: ['approve'],
			group: 'avatar-edit',
			memberName: 'approved',
			description: 'Draws an "approved" stamp over a user\'s avatar.',
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: ''
				}
			]
		});
	}

	async run(msg, { user }) {
		if (!user) user = msg.author;
		const avatarURL = user.displayAvatarURL({
			format: 'png',
			size: 512
		});
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'approved.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(avatar.width, avatar.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(avatar, 0, 0);
			ctx.drawImage(base, 0, 0, avatar.width, avatar.height);
			return msg.say({ files: [{
				attachment: canvas.toBuffer(),
				name: 'approved.png'
			}] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

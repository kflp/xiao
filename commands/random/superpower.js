const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { shorten } = require('../../util/Util');

module.exports = class SuperpowerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'superpower',
			group: 'random',
			memberName: 'superpower',
			description: 'Responds with a random superpower.'
		});
	}

	async run(msg) {
		try {
			const article = await this.randomSuperpower();
			const { body } = await request
				.get('http://powerlisting.wikia.com/api/v1/Articles/AsSimpleJson/')
				.query({ id: article });
			const data = body.sections[0];
			return msg.reply(stripIndents`
				Your superpower is... **${data.title}**!
				_${shorten(data.content.map(section => section.text).join('\n\n'), 1950)}_
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async randomSuperpower() {
		const { body } = await request
			.get('http://powerlisting.wikia.com/api.php')
			.query({
				action: 'query',
				list: 'random',
				rnnamespace: 0,
				rnlimit: 1,
				format: 'json',
				formatversion: 2
			});
		return body.query.random[0].id;
	}
};

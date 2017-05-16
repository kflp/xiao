const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class WouldYouRatherCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'would-you-rather',
            aliases: ['wyrather'],
            group: 'random',
            memberName: 'would-you-rather',
            description: 'Gets a random would you rather question.'
        });
    }

    async run(msg) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        try {
            const { body } = await snekfetch
                .get('http://www.rrrather.com/botapi');
            const embed = new RichEmbed()
                .setTitle(`${body.title}...`)
                .setURL(body.link)
                .setColor(0x9797FF)
                .setDescription(`${body.choicea} OR ${body.choiceb}?`);
            return msg.embed(embed);
        } catch (err) {
            return msg.say('An Error Occurred.');
        }
    }
};

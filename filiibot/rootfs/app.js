//Load express module with `require` directive
const express = require('express');
const app = express();
// Constant for port
const PORT = 8212;
const path = require('path');

// Import the discord.js module
const Discord = require('discord.js');
// Create an instance of a Discord client
const client = new Discord.Client();

// Here we import the options.json file
// from the add-on persistent data directory
// that contains our configuration
const config = require('/data/options.json');
// config.token contains the token of your bot
const token = config.token;
// config.prefix contains the message prefix
const prefix = config.prefix;

// Nodig voor externe files
const fs = require('fs');
var welcomeDm = fs.readFileSync('./welcomeDm.txt', 'utf8');

const io = require('socket.io-client');
const moment = require('moment');
var socket = io('https://www.ishetfiliikotopen.be');
var openclosed = '';

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('Bot is klaar!');
  console.log(`Ingelogd als ${client.user.tag}!`);
  client.user.setActivity('met de gevoelens van het filiikot');
});

// we are specifying the www directory as a public directory
app.use(express.static(path.join(__dirname, 'www')));

//Launch listening server on port 8212
app.listen(PORT, function() {
  console.log(`Bot listening on port ${PORT}!`);
})

/*
//Define request response in root URL (/)
app.get('/', function(req, res) {
  res.send('Hello world!');
})
*/

socket.on('update', function(msg) {
  console.log("Status van het filiikot geüpdatet");

  var since = moment(msg.since, "DD-MM-YYYY HH:mm:ss");

  if (msg.openclosed == 'open') {
    openclosed = '✅ Het filiikot is ' + msg.openclosed + ' sinds ' + since.format('HH:mm');
  } else {
    openclosed = '🛑 Het filiikot is ' + msg.openclosed;
  }

  // Set the client user's activity
  if (client.readyTimestamp) {
    // the client is ready
    //client.user.setActivity(openclosed, { url: 'https://www.ishetfiliikotopen.be/', type: 'PLAYING' })
    client.user.setPresence({
      status: 'online',
      afk: false,
      game: {
        name: openclosed,
        url: 'https://www.ishetfiliikotopen.be/',
        type: 'PLAYING'
      }
    })
  }
});

// Create an event listener for every single messages received, from any channel or DM.
client.on('message', async message => {
  // Check if the author is a bot, end botception!
  if (message.author.bot) return;

  //als het een DM is
  if (message.channel.type === 'dm') {
    return message.reply(`Het spijt me zeer, maar ik ben momenteel niet geïnteresseerd in persoonlijke relaties. Ik heb mijn handen al vol met Filii te dienen!`)
  }

  var bericht = message.content.toLowerCase();

  if (bericht.startsWith('ik ben') || bericht.startsWith('kben')) {
    return message.channel.send('Dag ' + message.content.substring(7) + ', ik ben de Filiibot!');
  }

  // Otherwise check if the prefix is there
  if (message.content.substring(0, 1) === prefix) {
    var string = message.content.substring(1);
    var array = string.split(' ');

    var command = array[0];
    // To get the "message" itself we join the array back into a string with spaces:
    var rest = array.splice(1).join(' ');

    switch (command) {
      // If the command is 'fk'
      case 'fk':
        message.reply(openclosed);
        break;

        // If the command is 'foo'
      case 'foo':
        message.channel.send('bar!');
        break;

        // If the command is 'kill'
      case 'kill':
        if (!message.member.roles.find('name', 'Praesidium')) {
          return message.reply("sorry, you don't have permissions to use this!");
        }

        console.log("shutting off!");
        message.reply("shutting down...")
        client.destroy((err) => {
          console.log(err);
        });
        break;

        // If the command is 'ping'
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
      case 'ping':
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Wachttijd is ${m.createdTimestamp - message.createdTimestamp}ms. API wachttijd is ${Math.round(client.ping)}ms`);
        break;

        // If the command is 'purge'
        // removes all messages from all users in the channel, up to 100.
      case 'purge':
        if (!message.member.roles.find('name', 'Praesidium')) {
          return message.reply("sorry, you don't have permissions to use this!");
        }

        // get the delete count, as an actual number.
        const deleteCount = parseInt(rest, 10);

        if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
          return message.reply('geef een getal tussen 2 en 100 voor het aantal te verwijderen berichten.');
        }

        // So we get our messages, and delete them.
        const fetched = await message.channel.fetchMessages({
          limit: deleteCount
        });
        message.channel.bulkDelete(fetched).catch(error => message.reply(`kon berichten niet verwijderen omdat: ${error}`));
        break;

        // If the command is 'say'
        // makes the bot say something and delete the message.
      case 'say':
        if (!message.member.roles.find('name', 'Praesidium')) {
          return message.reply("sorry, you don't have permissions to use this!");
        }

        // Then we delete the command message, the catch just ignores the error.
        message.delete().catch(errors => {});
        // And we get the bot to say the thing:
        message.channel.send(rest);
        break;

      case 'test':
        client.emit("guildMemberAdd", message.member);
        break;

      case 'up':
        let totalSeconds = (client.uptime / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60 * 100) / 100
        let uptime = `Uptime is ${hours} uren, ${minutes} minuten en ${seconds} seconden`;
        message.channel.send(uptime);
        break;

        // If the command is 'welcome'
      case 'welcome':
        message.channel.send(`De welkomsttekst is opnieuw naar je gestuurd, ${message.author}`);
        message.author.send(welcomeDm);
        break;
    }

    return;
  }

  var twaalfarray = bericht.replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/g);
  //var twaalfarray = bericht.bericht.split(/[^A-Za-z0-9]/);
  if (twaalfarray.includes('12') || twaalfarray.includes('twaalf') || twaalfarray.includes('dozijn')) {
    return message.reply('twaalf is zekerheid!');
  }
});

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  // If the joined member is a bot, do nothing.
  if (member.user.bot) return;
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find('name', 'aankondigingen');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welkom op de Discordserver van Filii Lamberti, ${member}`);
  member.send(welcomeDm);
});

// Log our bot in
client.login(token);

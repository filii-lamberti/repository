// Nodig voor externe files
const fs = require('fs');

// Here we import the options.json file
// from the add-on persistent data directory
// that contains our configuration
const options = JSON.parse(fs.readFileSync('/data/options.json', 'utf8'));

// status of logging
const { logging } = options;
// function to filter console logs
function log(message) {
  if (logging) {
    // eslint-disable-next-line no-console
    console.log(message);
  }
}
// prints if logging is true
if (logging) {
  log('Logging is enabled');
}

// status of debugging
const { debugging } = options;
// prints if debugging is true
if (debugging) {
  log('Debugging is enabled');
  process.env.DEBUG = '*';
}

// Gebruikt voor momenten
const moment = require('moment');
// Set the locale to dutch
moment.locale('nl');

// Setup basic express server
const express = require('express');
const path = require('path');

const app = express();
// Constant for port
const port = process.env.PORT || 3000;

// we are specifying the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/data', (req, res) => {
  res.json(filiikot);
});

// Launch listening server on port 8212
app.listen(port, () => {
  log(`listening on port ${port}!`);
});

const mqttOptions = {
  clientId: 'mqttjs_filiikot',
  username: 'ferre',
  password: 'ferre',
};

const filiikot = {
  state: 'OFF',
  temperature: 0,
  humidity: 0,
  lastChanged: moment(0),
  lastUpdated: moment(0),
  statusMessage: 'met de gevoelens van het filiikot',
};

// MQTT
const MQTT = require('mqtt');
// Connect to the local MQTT broker
const mqttClient = MQTT.connect('mqtt://core-mosquitto', mqttOptions);

mqttClient.on('connect', () => { // When connected
  log('MQTT connected');
  // subscribe to a topic
  mqttClient.subscribe('filiikot/+');
  // Inform controllers that garage is connected
  mqttClient.publish('filiikot/filiikot_connected', 'true');
});

// Read data that is available in "flowing mode"
mqttClient.on('message', (topic, message) => {
  switch (topic) {
    case 'filiikot/state':
      // message is Buffer
      filiikot.state = message.toString();
      log(`new state: ${filiikot.state}`);
      break;

    case 'filiikot/temperature':
      filiikot.temperature = message.toString();
      log(`Status van het filiikot geüpdatet, temperatuur: ${filiikot.temperature}`);
      break;

    case 'filiikot/humidity':
      filiikot.humidity = message.toString();
      log(`Status van het filiikot geüpdatet, vochtigheid: ${filiikot.humidity}`);
      break;

    case 'filiikot/last_changed':
      filiikot.lastChanged = moment(message.toString());
      log(`last changed: ${filiikot.lastChanged}`);
      break;

    case 'filiikot/last_updated':
      filiikot.lastUpdated = moment(message.toString());
      log(`last updated: ${filiikot.lastUpdated}`);
      break;

    default:
      return;
  }

  switch (filiikot.state) {
    case 'ON':
      filiikot.statusMessage = `✅ Het filiikot is open sinds ${filiikot.lastChanged.format('HH:mm')}`;
      break;

    case 'OFF':
      filiikot.statusMessage = `🛑 Het filiikot is al ${filiikot.lastChanged.fromNow(true)} gesloten`;
      break;

    default:
      filiikot.statusMessage = 'met de gevoelens van het filiikot';
      break;
  }
});

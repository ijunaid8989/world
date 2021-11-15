const fs = require('fs');

const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const replies = require("./utils/replies")

const SESSION_FILE_PATH = './session.json';

let sessionData;

if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

console.log(sessionData)

let client = null
let contactName = null

if (Object.keys(sessionData).length === 0) {
  client = new Client()
} else {
  client = new Client({
    session: sessionData
  })
}

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', message => {
  const contact = message.getContact();
  const name = contact.then(cont => {return cont.pushname})

  const chat = message.getChat()
  const chatDetails = chat.then(ch => {return ch})


  if(message.body === '!ping') {

    chatDetails.then(function(chat) {
      chat.sendStateTyping()
    })

    name.then(function(contactName) {
      message.reply(replies.ping(contactName));
    })
  }
});

client.on('authenticated', (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    if (err) {
      console.error(err);
    }
  });
});

client.initialize();
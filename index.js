import qrcode from "qrcode-terminal"

import {
  Client
} from "whatsapp-web.js"

const client = new Client();

client.on('qr', qr => {
  qrcode.generate(qr, {
    small: true
  });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize();

client.on('message', message => {
  console.log(message.body);
});

client.on('message', message => {
  if (message.body === '!ping') {
    message.reply('pong');
  }
})
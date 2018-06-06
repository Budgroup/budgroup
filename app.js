require("dotenv").config();

const token = process.env.TOKEN;
const TelegramBot = require('node-telegram-bot-api');

let bot = null;

if ( process.env.NODE_ENV === 'production' ) {
    bot = new TelegramBot(token);
    bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else 
    bot = new Bot(token, { polling: true });

bot.on('message', (msg) => {
    const name = msg.from.first_name;

    bot.sendMessage(msg.chat.id, 'Привет')
});

require('./web')(bot);
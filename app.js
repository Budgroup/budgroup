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

// Обработка начала общений
bot.onText(/\/start/, (msg, match) => {
    const name = msg.from.first_name;

    bot.sendMessage(msg.chat.id, "Привет, " + name + "! **Тут должна быть хелпа**");
    return 
})

bot.on('message', (msg) => {
    bot.sendMessage(msg.chat.id, 'Привет, дорогой')

    return 
});


// Отправляем экспресу бота для работы
require('./web')(bot);
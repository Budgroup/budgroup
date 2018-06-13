require("dotenv").config();

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;

const commands = require('./handlers/comands');

let bot = new TelegramBot(token);
bot.setWebHook(process.env.HEROKU_URL + token);

bot.on('message', (msg) => {
    if (!msg)  return;
    
    if (msg.text && msg.text.includes('@') && !msg.text.includes('Budget_bot')) return;
    
    const chatId = msg.chat.id;

    if (msg.chat.type == "private"){
        // Обработка личных сообщений

        if (msg.entities && msg.entities[0] && msg.entities[0].type === 'bot_command') {
            // Тут должна идти обработка команд
            console.log("Пришла команда ", msg);

            switch(msg.text){
                case '/start': 
                        commands.startCommand(bot, msg);
                    break;
                case '/help': 
                        commands.helpCommand(bot, msg);
                    break;
                case '/add':
                        commands.addCommand(bot, msg);
                    break;
                case '/list':
                        commands.listCommand(bot, msg);
                    break;
                case '/balance':
                        commands.balanceCommand(bot, msg);
                    break;
                case '/category':
                        commands.categoryCommand(bot, msg);
                    break;
            }

            
            return;
        }

                

    } 
    else {
        // Обработка сообщений группы
        bot.sendMessage(chatId, "Привет группе!");
    
        return;
    }
});


module.exports = bot;
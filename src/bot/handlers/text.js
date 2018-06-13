const config = require('jsonfile').readFileSync('src/bot/config.json');

const {
    Chat,
} = require('../../../models');

function handleText(bot, msg) {
    Chat.findOne({id : msg.chat.id.toString()}, (err, res) => {
        if (!err && res){
            let chat = res;

            // Обрабатываем статус чата
            switch(chat.getStatus()){
                case 0:
                    bot.sendMessage(msg.chat.id, "Cтатус 0");
                    break;
                case 1:
                    bot.sendMessage(msg.chat.id, "Cтатус 1");
                    break;
                case 2:
                    bot.sendMessage(msg.chat.id, "Cтатус 2");
                    break;
                default:
                    break;
            }
        }else {
            // Если произошла ошибка
            bot.sendMessage(msg.chat.id, convertArrayToString(config.error));
        }
    });
}

module.exports = handleText;
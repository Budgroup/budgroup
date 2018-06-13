const config = require('jsonfile').readFileSync('src/bot/config.json');

const {
    Chat,
} = require('../../../models');

const lib = require('../lib');

const handleText = (bot, msg) => {
    Chat.findOne({id : msg.chat.id.toString()}, (err, res) => {
        if (!err && res){
            let chat = res;

            // Обрабатываем статус чата
            switch(chat.getStatus()){
                case 0:
                    checkBalance(bot, msg, chat);
                    break;
                case 1:
                    checkSalary(bot, msg, chat);
                    break;
                case 2:
                    bot.sendMessage(msg.chat.id, "Cтатус 2");
                    break;
                default:
                    bot.sendMessage(msg.chat.id, "Cтатус default:)");
                    break;
            }
        }else {
            // Если произошла ошибка
            bot.sendMessage(msg.chat.id, lib.convertArrayToString(config.error));
        }
    });
}

// Обработка установка баланса
const checkBalance = (bot, msg, chat) => {
    if (Number(msg.text) && Number(msg.text) > 0){
        chat.balance = Number(msg.text);
        chat.status += 1;

        chat.save();

        bot.sendMessage(msg.chat.id, "Cупер! А теперь скажите на сколько пополняется ваш ежемесячный баланс(получил зарплату, взял у соседа/мамы/папы...)?");
    }else {
        bot.sendMessage(msg.chat.id, "Ну вы даете! Какой у вас реальный бюджет?");
    }
}  

// Обработка установки зарплаты
const checkSalary = (bot, msg, chat) => {
    if (Number(msg.text) && Number(msg.text) > 0){
        chat.salary = Number(msg.text);
        chat.status += 1;

        chat.save();

        bot.sendMessage(msg.chat.id, lib.convertArrayToString(config.registration.success));
    }else {
        bot.sendMessage(msg.chat.id, "Ну вы даете! Сколько вы реально зарабатываете?");
    }
} 

module.exports = handleText;
const config = require('jsonfile').readFileSync('src/bot/config.json');

const {
    Chat,
    Operation,
    OperationBody
} = require('../../../models');


const lib = require('../lib');

var Comands = {
    startCommand : (bot, msg) => {
        let newChat = new Chat({id : msg.chat.id.toString(), balance : 0, salary : 0, status : 0});

        // Если не было ошибок и не было подобных юзеров, тогда сохраняем их в базу
        Chat.findOne({id : msg.chat.id.toString()}, (err, res) => {
            if (!err && !res){
                newChat.save();
                bot.sendMessage(msg.chat.id, lib.convertArrayToString(config.start));
                
                bot.sendMessage(msg.chat.id, "Каков ваш текущий бюджет в рублях?");
            } else {
                // Если человек зарегистрирован, то отправляем ему хелп
                Comands.helpCommand(bot, msg);
            }
        });
    },
    helpCommand :  (bot, msg) => {
        bot.sendMessage(msg.chat.id, lib.convertArrayToString(config.help));
    },
    addCommand :  (bot, msg) => {
        bot.sendMessage(msg.chat.id, lib.convertArrayToString(config.add));
    },
    listCommand :  (bot, msg) => {
        // TODO: сделать вывод с переключателем всех транзакций пользователя
        // Выдается список последних 10 транзакций
        Chat.findOne({id : msg.chat.id.toString()}, async (err, res) => {
            if (!err && res){
                bot.sendMessage(msg.chat.id, "Последние транзакции: ", await lib.getSerializeOperations(res));
            }else {
                bot.sendMessage(msg.chat.id, "Произошла ошибка...\nПопробуйте позже!");
            }
        });
    },
    balanceCommand :  (bot, msg) => {
        // В сумме на счету ((имя баланса)) n денег
        Chat.findOne({id : msg.chat.id.toString()}, (err, res) => {
            if (!err && res){
                bot.sendMessage(msg.chat.id, "В сумме на счету " + res.balance + " рублей.");
            }else {
                bot.sendMessage(msg.chat.id, "Произошла ошибка...\nПопробуйте позже!");
            }
        });
    },
    categoryCommand :  (bot, msg) => {
        bot.sendMessage(msg.chat.id, lib.convertArrayToString(config.category));
    },
};

module.exports = Comands;
const config = require('jsonfile').readFileSync('src/bot/config.json');

const {
    Chat,
} = require('../../../models');

function convertArrayToString(arr) {
    var text = "";
    
    arr.forEach(element => {
        text += element + "\n";
    });

    return text;
}

var Comands = {
    startCommand : (bot, msg) => {
        bot.sendMessage(msg.chat.id, convertArrayToString(config.start));

        console.log('Вот что находится в "чате": ', Chat);
    },
    helpCommand :  (bot, msg) => {
        bot.sendMessage(msg.chat.id, convertArrayToString(config.help));
    },
    addCommand :  (bot, msg) => {
        bot.sendMessage(msg.chat.id, convertArrayToString(config.add));
    },
    listCommand :  (bot, msg) => {
        bot.sendMessage(msg.chat.id, convertArrayToString(config.list));
    },
    balanceCommand :  (bot, msg) => {
        bot.sendMessage(msg.chat.id, convertArrayToString(config.balance));
    },
    categoryCommand :  (bot, msg) => {
        bot.sendMessage(msg.chat.id, convertArrayToString(config.category));
    },
};

module.exports = Comands;
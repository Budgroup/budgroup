const config = require('jsonfile').readFileSync('src/bot/config.json');

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
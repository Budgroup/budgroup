const {
    Chat,
    Operation,
    OperationBody
} = require('../../../models');

const lib = require('../lib/index');

module.exports = {
    analyzeCallback : async (msg, bot) => {
        let doublePointPos = msg.data.indexOf(":");
        let chatId = msg.data.substring(0, doublePointPos);
        let operationId = msg.data.substring(doublePointPos + 1, msg.data.length);

        let operation = await OperationBody.find({_id : operationId}).exec(); operation = operation[0];
        let chat = await Chat.find({_id : chatId}).exec(); chat = chat[0];

        // TODO : переделать определение статистики
        if (operation.value > 0){
            let dailyRate = Math.floor( (chat.balance - operation.value) / lib.dayLeft());
            let newDailyRate = Math.floor( chat.balance / lib.dayLeft());
            console.log(dailyRate, newDailyRate);
            bot.sendMessage(msg.from.id, "Благодаря этому действию в среднем вы теперь можете тратить на " + (newDailyRate - dailyRate) + " руб. больше.");
        } else {
            let dailyRate = Math.floor( (chat.balance + operation.value) / lib.dayLeft());
            let newDailyRate = Math.floor( chat.balance / lib.dayLeft());
            bot.sendMessage(msg.from.id, "Из-за этого в среднем вам придется тратить на " + Math.abs(dailyRate - newDailyRate) + " руб. меньше.");
        }
    }
}
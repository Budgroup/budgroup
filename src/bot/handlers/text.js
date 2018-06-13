const config = require('jsonfile').readFileSync('src/bot/config.json');

const {
    Chat,
    Operation,
    OperationBody
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
                    checkText(bot, msg, chat);
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
    if (Number(msg.text) && Number(msg.text) > 0 && msg.text.indexOf('e') == -1){
        chat.balance = Number(msg.text);
        chat.status += 1;

        chat.save();

        bot.sendMessage(msg.chat.id, "Cупер! А теперь скажите на сколько пополняется ваш ежемесячный баланс(получил зарплату, взял у соседа/мамы/папы...)?");
    }else {
        bot.sendMessage(msg.chat.id, "Ну вы даете! Какой у вас реальный бюджет?");
    }
};  

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
};

// Обработка текст
const checkText = (bot, msg, chat) => {
    // TODO: если нет описания у транзакции, то запросить ее, но не настаивать

    let text = msg.text + " ";
    
    // Если пришла команда на удаление/добавление определенного баланса
    if (text[0] == '+' || text[0] == '-'){
        // Вырезаем сумму транзакции
        let spacePos = text.indexOf(" ");
        let operationPay = text.substring(0, spacePos);
        let operationText = text.substring(spacePos, text.length);

        // Добавляем новую операцию на сегодняшний день
        // TODO: сделать нормальный перерасчет транзакций
        let newOperationBody = new OperationBody({value : operationPay, description: operationText});
        newOperationBody.save();

        let today = new Date();
        let newOperation = new Operation(
            {
                time : new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1, 0, 0), 
                operationBody : newOperationBody
            }
        );
        newOperation.save();

        chat.operations.push(newOperation);
        chat.balance += Number(operationPay);
    
        chat.save();

        
        // TODO: переписать текст
        
        bot.sendMessage( msg.chat.id, "Текущий баланс : " + chat.balance + "\nСколько придется тратить каждый день : " + Math.floor(chat.balance / lib.dayLeft()) );
        bot.sendMessage(msg.chat.id, "Что-то еще?");        
    }else {
        // Отправляет это, если что-то пошло не так в случае добавления новой транзакции
        // TODO: переделать текст
        bot.sendMessage(msg.chat.id, "Уфф... Деньги... Попробуйте еще раз!");
    }
};

module.exports = handleText;
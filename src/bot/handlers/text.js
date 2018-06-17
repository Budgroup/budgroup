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
        // chat.balance += Number(operationPay);
    
        chat.save();

        
        if (operationPay < 0)
            analyzeMinus(bot, msg, chat, newOperationBody.value);
        else 
            analyzePluse(bot, msg, chat, newOperationBody.value);

    }else {
        // Отправляет это, если что-то пошло не так в случае добавления новой транзакции
        // TODO: переделать текст
        bot.sendMessage(msg.chat.id, "Уфф... Деньги... Попробуйте еще раз!");
    }
};

// Анализирует, если пришла отрицательная транзакция 
const analyzeMinus = (bot, msg, chat, pay) => {
    // TODO: Добавить проверку долгов
    // Проверяем дату
    let today = lib.getToday();
    if ( chat.today.getDate() != today.getDate() ){
        // Если последня трата совершенна не сегодня
        chat.today = today;
        chat.todayIsSpent = 0;

        chat.save();
    }

    let dailyRate = Math.floor( (chat.balance + chat.todayIsSpent) / lib.dayLeft());
    console.log("Daily rate:" + dailyRate);
    
    if ((-1) * pay < (dailyRate - chat.todayIsSpent) ) {
        // Если сумма вычета меньше дневной нормы

        chat.balance += Number(pay);
        chat.todayIsSpent -= pay;

        chat.save();

        bot.sendMessage( msg.chat.id, "Текущий баланс : " + chat.balance + "\nУ вас на сегодня осталось " + (dailyRate - chat.todayIsSpent) );
    }else if ( (-1) * pay == (dailyRate - chat.todayIsSpent) ) {
        // Если сумма выплат равна дневной норме

        chat.balance += Number(pay);
        chat.todayIsSpent += pay;
        chat.save();
        
        bot.sendMessage( msg.chat.id, "Текущий баланс : " + chat.balance + "\nУ вас на сегодня не осталось средств:(" );
    }else if ( (-1) * pay + chat.todayIsSpent < 2 * (dailyRate ) ) {
        // Если сумма меньше двойной выплаты

        if ( chat.dateCredit == today){
            // TODO : переделать этот способ анализа на тот, чтобы кредит перерасчитывался на остальны дни, либо вообще менялось dailyRate
            // Если мы сегодня уже брали кредит, то накидываем к нему еще

            chat.credit += (-1) * pay;
            chat.balance += pay;
            chat.todayIsSpent -= pay;
        } else {
            // Если мы не брали сегодня кредит, то ... 

            chat.credit = (-1) * pay;
            chat.dateCredit = today;
            chat.balance += pay;
            chat.todayIsSpent -= pay;
        }
        // Сохраняем изменения
        chat.save();

        bot.sendMessage( msg.chat.id, "На сегодня у вас не осталось средств:(\nВам придется завтра потратить " + (dailyRate - chat.credit) + ", а не " + dailyRate);
    } else {
        // Очевидно, что покупка была совершена не на расходники, а на что-то +-дорогое для данного человека
        chat.balance += pay;

        chat.save();
        bot.sendMessage( msg.chat.id, "Приятного Вам удовольствия от покупки;)\nТеперь каждый день вам придется тратить по " + (Math.floor(chat.balance / lib.dayLeft())) + " рублей");
    }
};

// Анализирует, если пришла положительная транзакция
const analyzePluse = (bot, msg, chat, pay) => {
    // TODO: сделать проверку долга на следующий день и добавить в бюджет    
    chat.balance += pay;
    chat.save();

    let dailyRate = Math.floor(chat.balance  / lib.dayLeft());

    bot.sendMessage( msg.chat.id, "Круто! Теперь можно каждый день тратить по " + dailyRate + " рублей");
};

module.exports = handleText;
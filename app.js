// Подключение база
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.URI, 
{
    server: {
        socketOptions: {
        socketTimeoutMS: 10000,
        connectTimeoutMS: 50000,
      },
    },
}, 
() => {
    console.log('База работает');
},
(err) => {
    console.log('База не работает: ', err);
});

// Инициализируем бота
const bot = require('./src/bot/bot');

// Отправляем экспресу бота для работы
require('./src/web')(bot);
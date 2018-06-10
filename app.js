const bot = require('./src/bot/bot');

const mongoose = require('mongoose');
mongoose.connect(process.env.URI, { useMongoClient: true }, () => {
    console.log('База запахала');
},
(err) => {
    console.log('Туши огонь, база сдохла ', err);
});

// Отправляем экспресу бота для работы
require('./src/web')(bot);
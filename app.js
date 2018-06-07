const bot = require('./src/bot/bot');

// const mongoose = require('mongoose');
// mongoose.connect("mongodb://<dbuser>:<dbpassword>@ds147440.mlab.com:47440/budgroup", { useMongoClient: true });

// Отправляем экспресу бота для работы
require('./src/web')(bot);
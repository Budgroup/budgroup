const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const chatSchema = new Schema({
    id : {
        type : String,
        required : true,
    },
    balance : {
        type : Number,
        required : true,
    },
    salary : {
        type : Number,
        required : true,
    },
    /*
        0 - 2 -- аккаунт не активирован 
        0 - только что зарегистрирован
        1 - ответил на вопрос о текущем балансе
        2 - ответил на вопрос о сумме ежемесячного пополнения
    */
    status : {
        type : Number,
        required : true,
    }
}, { timestamps: true });

module.exports = mongoose.model('chat', chatSchema);
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
        0 - 1 -- аккаунт не активирован 
        0 - только что зарегистрирован
        1 - ответил на вопрос о текущем балансе
        2 - ответил на вопрос о сумме ежемесячного пополнения
    */
    status : {
        type : Number,
        required : true,
    }
}, { timestamps: true });

chatSchema.methods = {
    getStatus(){
        return this.status;
    },
};

module.exports = mongoose.model('chat', chatSchema);
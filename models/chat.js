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
    }
}, { timestamps: true });

module.exports = mongoose.model('chat', chatSchema);
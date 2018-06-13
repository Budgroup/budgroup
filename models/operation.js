const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const operationSchema = new Schema({
    time : {
        type : Date,
        required : true,
    },
    operationBody : [{
        type : Schema.ObjectId,
        ref : 'operationBody',
        default : [],
    }]
}, { timestamps: true });




module.exports = mongoose.model('operation', operationSchema);
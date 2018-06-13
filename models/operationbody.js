const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const operationBodySchema = new Schema({
    value : Number,
    description : {
        type : String,
        default : "",
    }
}, { timestamps: true });

module.exports = mongoose.model('operationBody', operationBodySchema);
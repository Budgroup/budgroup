const {
    Chat,
    Operation,
    OperationBody
} = require('../../../models');

module.exports = {
    convertArrayToString : (arr) => {
        var text = "";
        
        arr.forEach(element => {
            text += element + "\n";
        });
    
        return text;
    },

    dayLeft : () => {
        let today = new Date();
        let lastDay = (new Date(today.getUTCMonth(), today.getDate() + 1, 0)).getDate();

        return lastDay - today.getDate() + 1;
    },
    getToday : () => {
        let today = new Date();   
        today = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1, 0, 0);
        
        return today;
    },
    getOperations : async (bot) => {
        let array = [];

        try{
            for(let i = 0; i < bot.operations.length; i++){
                let operationsData = await Operation.find( {"_id" : bot.operations[i]}).exec();
                let operBodyData = await OperationBody.find({"_id" : operationsData[0].operationBody[0]}).exec();
                operBodyData = operBodyData[0];
                array.push(operBodyData.value + " руб. - " + operBodyData.description);
            }
        }
        catch (err) {console.log("getOperation Error " + err)};

        return array;
    },
    getSerializeOperations : async (bot) => {
        let operations = await module.exports.getOperations(bot);

        let outputData = {inline_keyboard: []};

        for(let i = 0; i < operations.length; i++){
            // TODO: сделать нормальную кол бек дату
            outputData.inline_keyboard.push([{text : operations[i], callback_data : i}])
        }

        return {reply_markup : JSON.stringify(outputData) };
    }
}
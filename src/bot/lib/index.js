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
            await bot.operations.forEach( (element) => {
                Operation.find( {"_id" : element}, (err, res) => {
                    OperationBody.find({"_id" : res[0].operationBody[0]}, (err, res) => {
                        res = res[0];
                        array.push(res.value + " -- " + res.description);
                    })
                })
            });
        }
        catch (err) {console.log("getOperation Error " + err)};

        return array;
    },
    getSerializeOperations : (bot) => {
        let operations = module.exports.getOperations(bot);

        console.log(operations)

        return {};
    }
}
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
    }
}
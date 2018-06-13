module.exports = {
    convertArrayToString : (arr) => {
        var text = "";
        
        arr.forEach(element => {
            text += element + "\n";
        });
    
        return text;
    }
}
module.exports = {
    compare: function compare(str1,str2){
        var success = 0;
        var failure = 0;
        if(str1 == str2){
            success ++
        }else{
            failure ++
        }
        var sucessrate = ((success/(success+failure))*100)
        return (sucessrate)
    },
    randomIntFromInterval: function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
};
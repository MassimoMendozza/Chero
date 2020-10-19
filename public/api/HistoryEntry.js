
const crypto = require('crypto');

class HistoryEntry{
    constructor(hash, moodArray, valuesArray, date, weekDay, minutes, outcome){
        this.hashID = hash;
        this.moodArray = moodArray;
        this.valuesArray = valuesArray;
        this.weekDay=weekDay;
        this.date=date;
        this.minutes=minutes;
        this.outcome=outcome;
    }
}

module.exports = HistoryEntry;
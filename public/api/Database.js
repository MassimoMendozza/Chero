const Store = require('electron-store');
const Porn = require('./Porn');
const HistoryEntry = require('./HistoryEntry')

class Database extends Store {
    constructor(settings) {
        super(settings);
        var memory = this.get('pornList') || [];
        var i = 0;
        this.pornList = [];
        while (!(typeof memory[i] == 'undefined')) {
            this.pornList = [...this.pornList, new Porn(memory[i].title, memory[i].tags, memory[i].actors, memory[i].thumbnail, memory[i].url)];
            i++;
        }
        i = 0;
        memory = this.get('history') || [];
        this.history = [];
        while (!(typeof memory[i] == 'undefined')) {
            this.history = [...this.history, memory[i]];
            i++;
        }
    }

    getPornFromHash(hash){
        for(var i=0; i<this.pornList.length; i++){
            if(this.pornList[i].hashID===hash){
                return this.pornList[i];
            }
        }
        return undefined;
    }

    getHistorySize(){
        return this.history.length;
    }

    getTagsArray() {
        var tagsArray = [];
        for (var i = 0; i < this.pornList.length; i++) {
            var tempTags = this.pornList[i].tags;
            for (var s = 0; s < tempTags.length; s++) {
                var tempLowcase = tempTags[s].toLowerCase();
                if (!(tagsArray.includes(tempLowcase))) {
                    tagsArray = [...tagsArray, tempLowcase];
                }
            }
        }
        tagsArray.sort();
        return tagsArray;
    }

    addHistory(hash, moodArray, valuesArray, date, weekDay, minutes, outcome) {
        this.history = [...this.history, new HistoryEntry(hash, moodArray, valuesArray, date, weekDay, minutes, outcome)];
        this.set('history', this.history);
        return this;
    };

    getTagsZeroMatrix() {
        var tagsZeroMatrix = {};
        var tempTagsArray = this.getTagsArray();
        for (var i = 0; i < tempTagsArray.length; i++) {
            tagsZeroMatrix[tempTagsArray[i]] = 0;
        }
        return tagsZeroMatrix;
    }

    getActorsArray() {
        var actorsArray = [];
        for (var i = 0; i < this.pornList.length; i++) {
            var tempActors = this.pornList[i].actors;
            for (var s = 0; s < tempActors.length; s++) {
                var tempLowcase = tempActors[s].toLowerCase();
                if (!(actorsArray.includes(tempLowcase))) {
                    actorsArray = [...actorsArray, tempLowcase];
                }
            }
        }
        actorsArray.sort();
        return actorsArray;
    }

    getActorsZeroMatrix() {
        var actorsZeroMatrix = {};
        var tempActorsArray = this.getActorsArray();
        for (var i = 0; i < tempActorsArray.length; i++) {
            actorsZeroMatrix[tempActorsArray[i]] = 0;
        }
        return actorsZeroMatrix;
    }

    savePornList() {
        this.set('pornList', this.pornList);
        return this;
    }

    getPornList() {
        return this.pornList;
    }

    getPornsNumber() {
        return this.pornList.length;
    }

    addPorn(porn) {
        if (porn instanceof Porn) {
            this.pornList = [...this.pornList, porn];
            this.savePornList();
        } else {
            throw new Error("Trying to add a non Porn obj into the database");
        }
    }

    getActorsMatrixFromHash(hash) {
        var RequestedPorn;
        var found = false;
        var Matrix = this.getActorsZeroMatrix();
        for (var x = 0; (x < this.pornList.length) && (!found); x++) {
            if (this.pornList[x].hashID === hash) {
                RequestedPorn = this.pornList[x];
                found = true;
            }
        }
        if (found) {
            var actorsArray = RequestedPorn.actors;
            for (var i = 0; i < actorsArray.length; i++) {
                Matrix[actorsArray[i]] = 1;
            }
        }
        return Matrix;
    }

    getEvaluateObj(hashID, moodArray, valuesArray, weekDay, date, minutes) {
        var InputEntry = {};
        var ActorsEntry = this.getActorsMatrixFromHash(hashID);
        var TagsEntry = this.getTagsMatrixFromHash(hashID);
        var MoodEntry = moodArray;
        var ValuesArray = valuesArray;
        var WeekDay = weekDay;
        var Date = date;
        var Minutes = minutes;
        //putting actors
        for (var a in ActorsEntry) {
            InputEntry[a] = ActorsEntry[a];
        }
        //putting tags
        for (var a in TagsEntry) {
            InputEntry[a] = TagsEntry[a];
        }
        //putting moods
        for (var a in MoodEntry) {
            InputEntry[a] = MoodEntry[a];
        }
        //putting values
        for (var a in ValuesArray) {
            InputEntry[a] = ValuesArray[a];
        }
        //putting the rest
        InputEntry['weekDay'] = WeekDay;
        InputEntry['date'] = Date;
        InputEntry['minutes'] = Minutes;

        return InputEntry;
    }

    getEvaluateArray(moodArray, valuesArray, weekDay, date, minutes) {
        var EvArray = [];
        for(var i=0; i<this.pornList.length;i++){
            EvArray[i]={
                hashID:this.pornList[i].hashID,
                evaluateObj:this.getEvaluateObj(this.pornList[i].hashID, moodArray, valuesArray, weekDay, date, minutes)
            };
        }

        return EvArray;
    }

    getTagsMatrixFromHash(hash) {
        var RequestedPorn;
        var found = false;
        var Matrix = this.getTagsZeroMatrix();
        for (var x = 0; (x < this.pornList.length) && (!found); x++) {
            if (this.pornList[x].hashID === hash) {
                RequestedPorn = this.pornList[x];
                found = true;
            }
        }
        if (found) {
            var tagsArray = RequestedPorn.tags;
            for (var i = 0; i < tagsArray.length; i++) {
                Matrix[tagsArray[i]] = 1;
            }
        }
        return Matrix;
    }



    getTrainArrayFromHistory() {
        var TrainArray = [];
        for (var i = 0; i < this.history.length; i++) {
            var InputEntry = {};
            var OutputEntry = {};
            var ActorsEntry = this.getActorsMatrixFromHash(this.history[i].hashID);
            var TagsEntry = this.getTagsMatrixFromHash(this.history[i].hashID);
            var MoodEntry = this.history[i].moodArray;
            var ValuesArray = this.history[i].valuesArray;
            var WeekDay = this.history[i].weekDay;
            var Date = this.history[i].date;
            var Minutes = this.history[i].minutes;
            var Outcome = this.history[i].outcome;
            //putting actors
            for (var a in ActorsEntry) {
                InputEntry[a] = ActorsEntry[a];
            }
            //putting tags
            for (var a in TagsEntry) {
                InputEntry[a] = TagsEntry[a];
            }
            //putting moods
            for (var a in MoodEntry) {
                InputEntry[a] = MoodEntry[a];
            }
            //putting values
            for (var a in ValuesArray) {
                InputEntry[a] = ValuesArray[a];
            }
            //putting the rest
            InputEntry['weekDay'] = WeekDay;
            InputEntry['date'] = Date;
            InputEntry['minutes'] = Minutes;
            OutputEntry['outcome'] = Outcome;
            TrainArray[i] = {
                input: InputEntry,
                output: OutputEntry
            };
        }
        return TrainArray;
    }

    deletePorn(porn) {

    }

    isPresent(porn) {
        var i = 0;
        while (i < this.pornList.length) {
            if (this.pornList[i].getHashID() === porn.getHashID()) {
                return true;
            }
            console.log(this.pornList[i].getHashID());
            i++;
        }
        return false;
    }
}

module.exports = Database;
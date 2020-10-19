const Store = require('electron-store');
const Porn = require('./Porn');
const HistoryEntry = require('./HistoryEntry')

class Database extends Store{
    constructor(settings){
        super(settings);
        var memory=this.get('pornList')|| [];
        var i=0;
        this.pornList=[];
        while(!(typeof memory[i] == 'undefined')){
            this.pornList = [...this.pornList, new Porn(memory[i].title,memory[i].tags,memory[i].actors,memory[i].thumbnail,memory[i].url)];
            i++;
        }
        var memory=this.get('history')|| [];
        this.history=[];
        while(!(typeof memory[i] == 'undefined')){
            this.history = [...this.history, memory[i]];
            i++;
        }
    }

    getTagsArray(){
        var tagsArray=[];
        for(var i=0; i<this.pornList.length; i++){
            var tempTags=this.pornList[i].tagsArray();
            for(var s=0; s<tempTags.length; s++){
                var tempLowcase= tempTags[s].toLowerCase();
                if(!(tagsArray.includes(tempLowcase))){
                    tagsArray=[...tagsArray, tempLowcase];
                }
            }
        }
        tagsArray.sort();
        return tagsArray;
    }

    addHistory(hash, moodArray, valuesArray, date, weekDay, minutes, outcome){
        this.history=[...this.history, new HistoryEntry(hash, moodArray, valuesArray, date, weekDay, minutes, outcome)];
        this.set('history', this.history);
        return this;
    };

    getTagsZeroMatrix(){
        var tagsZeroMatrix = [];
        var tempTagsArray=getTagsArray();
        for(var i=0; i<tempTagsArray.length; i++){
            tagsZeroMatrix[tempTagsArray[i]]=0;
        }
        return tagsZeroMatrix;
    }

    getActorsArray(){
        var actorsArray=[];
        for(var i=0; i<this.pornList.length; i++){
            var tempActors=this.pornList[i].getActors();
            for(var s=0; s<tempActors.length; s++){
                var tempLowcase= tempActors[s].toLowerCase();
                if(!(actorsArray.includes(tempLowcase))){
                    actorsArray=[...actorsArray, tempLowcase];
                }
            }
        }
        actorsArray.sort();
        return actorsArray;
    }

    getActorsZeroMatrix(){
        var actorsZeroMatrix = [];
        var tempActorsArray=getActorsArray();
        for(var i=0; i<tempActorsArray.length; i++){
            actorsZeroMatrix[tempActorsArray[i]]=0;
        }
        return actorsZeroMatrix;
    }

    savePornList(){
        this.set('pornList', this.pornList);
        return this;
    }

    getPornList(){
        return this.pornList;
    }

    getPornsNumber(){
        return this.pornList.length;
    }

    addPorn(porn){
        if(porn instanceof Porn){
        this.pornList = [...this.pornList, porn];
        this.savePornList();
        }else{
            throw new Error("Trying to add a non Porn obj into the database");
        }
    }

    deletePorn(porn){

    }

    isPresent(porn){
        var i=0;
        while(i<this.pornList.length){
            if(this.pornList[i].getHashID()===porn.getHashID()){
                return true;
            }
            console.log(this.pornList[i].getHashID());
            i++;
        }
        return false;
    }
}

module.exports = Database;
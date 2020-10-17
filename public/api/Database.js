const Store = require('electron-store');
const Porn = require('./Porn');

class Database extends Store{
    constructor(settings){
        super(settings);
        var memory=this.get('pornList')|| [];
        var i=0;
        this.pornList=[];
        while(!(typeof memory[i] == 'undefined')){
            this.pornList = [...this.pornList, new Porn(memory[i].title,memory[i].tags,memory[i].actors)];
            i++;
        }
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
        if(typeof porn === "Porn"){
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
        console.log('new');
        console.log(porn.getHashID());
        console.log(this.pornList.lenght);
        console.log('while');
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
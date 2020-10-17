
const crypto = require('crypto');

class Porn{

    constructor(title, tags, actors, thumbnail){
        this.title = title;
        this.tags = tags;
        this.actors = actors;
        this.thumbnail=thumbnail;
        this.actorsString=this.getActorsString();
        this.tagsString=this.getTagsString();
        this.hashID=this.getHashID();
    }

    getHashID(){
        return crypto.createHash('sha512').update(this.title+this.actorStrings+this.tagsString).digest('hex');
    }
    
    setTitle(title){
        this.title=title;
    }

    getTitle(){
        return this.title;
    }

    setTags(tags){
        this.tags = tags;
    }

    getTags(){
        return this.tags;
    }

    setActors(actors){
        this.actors=actors;
    }

    getActors(){
        return this.actors;
    }

    addActor(actor){
        if(!(this.actors.includes(actor.toLowerCase()))){
            this.actors=[...this.actors, actor.toLowerCase()];
        }
    }

    addTag(tag){
        if(!(this.tags.includes(tag.toLowerCase()))){
            this.tags=[...this.actors, tag.toLowerCase()];
        }
    }

    getActorsString(){
        var i;
        this.actorsString="";
        for(i=0; i<this.actors.length; i++){
            console.log(this.actors[i]);
            if(i>0){
                this.actorsString=this.actorsString.concat(', ');
            }
            this.actorsString=this.actorsString.concat(this.actors[i]);
        }
        this.actorsString=this.actorsString.concat('.');
        console.log(this.actorsString);
        return this.actorsString;
    }

    getTagsString(){
        var i;
        this.tagsString="";
        for(i=0; i<this.tags.length; i++){
            console.log(this.tags[i]);
            if(i>0){
                this.tagsString=this.tagsString.concat(', ');
            }
            this.tagsString=this.tagsString.concat(this.tags[i]);
        }
        this.tagsString=this.tagsString.concat('.');
        console.log(this.tagsString);
        return this.tagsString;
    }
}

module.exports = Porn;
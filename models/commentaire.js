const mongoose = require('mongoose');

var commentaireSchema = new mongoose.Schema({
    nom        : {type:String, required:true},
    email      : {type:String, required:true},
    commentaire: {type:String, required:true},
    date       : {type:Date, default:Date.now},
    article    : {type:mongoose.Schema.Types.ObjectId, ref:'Article'}
})

module.exports = mongoose.model("Commentaire", commentaireSchema);

const mongoose        = require('mongoose'),
      uniqueValidator = require('mongoose-unique-validator');


var categorieSchema = new mongoose.Schema({
    categorie: {type:String, required:true}
})

categorieSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Categorie", categorieSchema);

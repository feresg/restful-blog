const mongoose        = require('mongoose'),
	  uniqueValidator = require('mongoose-unique-validator'),
	  slug            = require('slug'),
	  moment          = require('moment');

var articleSchema = new mongoose.Schema({
	slug             : {type:String, lowercase:true, unique:true, required:true},
	titre            : {type:String, required:true},
	auteur           : {type:String, required:true},
	extrait          : {type:String},
	article          : {type:String, required:true},
    image            : {type:String},
	date_creation    : {type:Date, default:Date.now()},
	date_modification: {type:Date, default:Date.now()},
	isPublished      : {type:Boolean, required:true},
	allowComments    : {type:Boolean, required:true},
	categorie        : {type:String},
	commentaires     : [{type:mongoose.Schema.Types.ObjectId, ref:'Commentaire'}]
});

articleSchema.plugin(uniqueValidator);

articleSchema.methods.slugify = function(){
    this.slug = slug(this.titre) + '-' +moment(this.date_creation).format('YYYYMMDDHHmmss');
};

articleSchema.pre('validate', function(next){
    if(!this.slug){
        this.slugify();
    }
    return next();
});

module.exports = mongoose.model("Article", articleSchema);
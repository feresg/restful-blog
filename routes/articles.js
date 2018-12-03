const express  = require("express"),
      fs       = require('fs');

var Article     = require("../models/article"),
    Categorie   = require("../models/categorie"),
    Commentaire = require("../models/commentaire");

const {upload} = require("../config/multer");
const {ensureAuthenticated} = require('../middleware/auth');


var router = express.Router();


// INDEX
router.get('/', ensureAuthenticated, (req, res) => {
    const articleFilter = req.user.username == 'admin' ? {} : {auteur:req.user.username};
    Article.find(articleFilter)
        .then(articles => res.render("articles/index",{articles, title: 'ARTICLES'}))
        .catch(err => console.log(err))
});

// CREATE FORM
router.get('/new', ensureAuthenticated, (req, res) => {
    Categorie.find({})
        .then(categories => res.render("articles/new", {categories, title:'ARTICLES'}))
        .catch(err => console.log(err))
});

// CREATE
router.post('/',ensureAuthenticated, upload('articles'), (req, res) => {
    let newArticle = req.body.article;
    console.log(newArticle);
    newArticle.image = req.file.filename;
    newArticle.auteur = req.user.username;
    if(req.body.commentaires == 'on'){
        newArticle.allowComments = true;
    }else{
        newArticle.allowComments = false;
    }
    if(req.body.statut == 'public'){
        newArticle.isPublished = true;
    }else{
        newArticle.isPublished = false;
    }
    Article.create(newArticle)
        .then(article => {
            req.flash('success_msg', 'Article ajouté avec succés!')
            res.redirect(`/${article.slug}`)}
        )
        .catch(err => console.log(err))
});

// EDIT FORM
router.get('/:id/edit', ensureAuthenticated, (req, res) => {
    Article.findById(req.params.id)
        .then(article => {
            Categorie.find({})
                .then(categories => res.render("articles/edit", {article, categories, title:'ARTICLES'}))
                .catch(err => console.log(err))
        })
})
// EDIT
router.put('/:id', ensureAuthenticated, upload('articles'), (req, res) => {
    Article.findByIdAndUpdate(req.params.id, req.body.article)
        .then(article => {
            if(req.body.commentaires == 'on'){
                article.allowComments = true;
            }else{
                article.allowComments = false;
            }
            if(req.body.statut == 'public'){
                article.isPublished = true;
            }else{
                article.isPublished = false;
            }
            if(req.file != undefined){
                fs.unlink(`public/img/uploads/articles/${article.image}`, (err) => {
                  if(err){
                    console.log(err);
                  }else{
                    console.log(`public/img/uploads/articles/${article.image} was deleted`);
                  }
                })
                article.image = req.file.filename;
            }
            article.date_modification = Date.now();
            article.save()
                .then(() => {
                    req.flash('success_msg', 'Article modifié avec succés!');
                    res.redirect(`/${article.slug}`);
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err));
})

// DELETE
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Article.findByIdAndDelete(req.params.id)
        .then(article => {
            fs.unlink(`public/img/uploads/articles/${article.image}`, (err) => {
                if(err){
                  console.log(err);
                }else{
                  console.log(`public/img/uploads/articles/${article.image} was deleted`);
                }
            })
            article.commentaires.forEach((commentaire) => {
                Commentaire.findByIdAndRemove(commentaire)
                    .then(() => article.remove())
                    .catch(err => console.log(err))
            })
            req.flash('success_msg', 'Article supprimé avec succés!');
            res.redirect('/admin/articles')
        })
        .catch(err => console.log(err))
})

// Article Status
router.put('/:id/edit/comments', ensureAuthenticated, (req, res) => {
    Article.findOne({_id:req.params.id})
        .then(article => {
            article.allowComments = !(article.allowComments);
            let status = (article.allowComments) ? "activés" : "desactivés";
            article.save()
                .then(() => {
                    req.flash('success_msg', `Commentaires ${status} pour cet article`);
                    res.redirect(`/${article.slug}`);
                })
                .catch(err => console.log(err))
            res.redirect(`/${article.slug}`)
        })
        .catch(err => console.log(err))
})
router.put('/:id/edit/status', ensureAuthenticated, (req, res) => {
    Article.findOne({_id:req.params.id})
        .then(article => {
            article.isPublished = !(article.isPublished);
            article.date_modification = Date.now();
            let status = (article.isPublished) ? "public" : "privé";
            article.save()
                .then(() => {
                    req.flash('success_msg', `Cet article est désormais ${status}`)
                    res.redirect(`/${article.slug}`)
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
});

module.exports = router;
const express  = require("express");

var Article     = require("../models/article"),
    Commentaire = require("../models/commentaire")

const {ensureAuthenticated} = require('../middleware/auth');

var router = express.Router();

// INDEX
router.get('/', (req, res) => {
    Article.find({isPublished:true})
        .then(articles => {
            Article.find().distinct('categorie')
                .populate('commentaires')
                .then(categories => {
                    Article.find().distinct('auteur')
                        .then(auteurs => {
                            res.render('index', {articles, categories, auteurs,title:'BLOG'})
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
});

// SHOW
router.get('/:slug', (req, res) => {
    Article.findOne({slug:req.params.slug})
        .populate('commentaires')
        .then(post => {
            res.render('post', {post, title:'BLOG'});
        })
        .catch(err => console.log(err))
});

// INDEX (CATEGORIES)
router.get('/categorie/:categorie', (req, res) => {
    Article.find({isPublished:true, categorie:req.params.categorie})
    .then(articles => {
        Article.find().distinct('categorie')
            .then(categories => {
                Article.find().distinct('auteur')
                    .then(auteurs => res.render('filter', {articles,categories, auteurs, header: `Articles dans "${req.params.categorie}"`,title:'BLOG'}))
                    .catch(err => console.log(err))

            })
            .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
})

// INDEX (AUTHOR)
router.get('/auteur/:auteur', (req, res) => {
    Article.find({isPublished:true, auteur:req.params.auteur})
        .then(articles => {
            Article.find().distinct('categorie')
                .then(categories => {
                    Article.find().distinct('auteur')
                        .then(auteurs => res.render('filter', {articles,categories, auteurs, header: `Articles publiés par ${req.params.auteur}`,title:'BLOG'}))
                        .catch(err => console.log(err))

                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})


// POST COMMENT
router.post('/:slug/commentaires', (req, res) => {
    let newCommentaire = {nom: req.body.nom, email:req.body.email, commentaire:req.body.commentaire}
    Commentaire.create(newCommentaire)
        .then(commentaire => {
            Article.findOne({slug:req.params.slug})
                .then(article => {
                    article.commentaires.push(commentaire)
                    commentaire.article = article;
                    commentaire.save()
                        .then()
                        .catch(err => console.log(err))
                    article.save()
                        .then(() => {
                            req.flash('success_msg', 'Commentaire ajouté avec succés.')
                            res.redirect(`/${req.params.slug}`);

                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
});
// DELETE COMMENT
router.delete('/:slug/commentaires/:commentid', ensureAuthenticated , (req, res) => {
    Commentaire.findById(req.params.commentid)
        .then(commentaire => {
            Article.findOneAndUpdate({slug:req.params.slug}, {$pull:{commentaires:commentaire._id}})
            .then(article => {
                commentaire.remove()
                req.flash('success_msg', 'Commentaire supprimé avec succés.')
                res.redirect(`/${req.params.slug}`)
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

module.exports = router;
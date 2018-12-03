const express = require("express");

var Categorie = require("../models/categorie");

const {ensureAuthenticated} = require('../middleware/auth');

var router = express.Router();

router.get('/',ensureAuthenticated, (req, res) => {
    Categorie.find({})
        .then(categories => res.render("categories/index",{categories, title: 'CATEGORIES'}))
        .catch(err => console.log(err))
});
router.post('/', ensureAuthenticated, (req, res) => {
    let categorie = {categorie:req.body.categorie}
    Categorie.create(categorie)
        .then(categorie => {
            req.flash('success_msg', 'Categorie ajoutée avec succés')
            res.redirect("/admin/categories")
        })
        .catch(err => console.log(err))
});
router.put('/:id',ensureAuthenticated, (req, res) => {
    let updatedCategorie = {categorie:req.body.categorie}
    Categorie.findByIdAndUpdate(req.params.id, updatedCategorie)
        .then(categorie => {
            req.flash('success_msg', 'Categorie modifiée avec succés')
            res.redirect('/admin/categories')
        })
        .catch(err => console.log(err))
})
router.delete('/:id',ensureAuthenticated, (req, res) => {
    Categorie.findByIdAndDelete(req.params.id)
    .then(categorie => {
        req.flash('success_msg', 'Categorie supprimée avec succés')
        res.redirect('/admin/categories')
    })
    .catch(err => console.log(err))
})
module.exports = router;

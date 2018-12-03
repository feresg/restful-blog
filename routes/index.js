const express    = require("express"),
      nodemailer = require("nodemailer"),
      bcrypt     = require("bcryptjs"),
      passport   = require("passport");

var Article     = require("../models/article"),
    Categorie   = require("../models/categorie"),
    Commentaire = require("../models/commentaire"),
    User        = require("../models/user");

var router = express.Router();

const {mailOptions, transporter} = require('../config/nodemailer')
const {ensureAuthenticated} = require('../middleware/auth');


router.get('/admin',ensureAuthenticated, (req, res) => {
    const articleFilter = req.user.username == 'admin' ? {} : {auteur:req.user.username};
    // const commentFilter = req.user.username == 'admin' ? {} : {article.auteur:req.user.username};
    var promises = [
        Article.find(articleFilter).exec(),
        Categorie.find({}).exec(),
        Commentaire.find().exec(),
        Article.find({}).distinct('auteur').exec(),
        Article.find({allowComments:false}).exec(),
        Article.find({isPublic:false}).exec(),
      ];
      Promise.all(promises)
        .then((results) => {
            res.render('admin', {title: 'ADMIN', articles: results[0].length,categories:results[1].length, commentaires: results[2].length, auteurs:results[3].length, noComment:results[4].length, private: results[5].length});
        })
        .catch((err) => console.log(err));
});

router.post('/send', (req, res) => {
    const output = `
        <h2>Vous avez reçu un mail</h2>
        <h3>Details</h3>
        <ul>
            <li><strong>Nom :</strong> ${req.body.nom}</li>
            <li><strong>Email :</strong> ${req.body.email}</li>
        </ul>
        <h3>Sujet</h3>
        <p>${req.body.sujet}</p>
        <h3>Message</h3>
        <p>${req.body.message}</p>`;
    // send mail with defined transport object
    transporter.sendMail(mailOptions(req.body.email, req.body.nom, req.body.sujet,output), (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        req.flash('success_msg', 'Votre mail a été envoyé avec succés!');
        res.redirect('/');
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});

// Auth Routes
router.get('/register', (req, res) => {
    res.render('register', {title:'REGISTER'});
})
router.post('/register', (req, res) => {
    console.log(req.body);
    const newUser = new User({username:req.body.username, password:req.body.password});
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) {console.log(err)};
            newUser.password = hash;
            newUser.save()
                .then(user => {console.log(user); res.redirect('/login')})
                .catch(err => console.log(err))
        })
    })
})

router.get('/login', (req, res) => {
    res.render('login', {title:'LOGIN'});
})
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:'/admin',
        failureRedirect:'/login',
        failureFlash:true
    })(req, res, next);
})
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Vous êtes deconnectés')
    res.redirect('/')
})

module.exports = router;
const express        = require('express'),
      mongoose       = require('mongoose'),
      methodOverride = require('method-override'),
      bodyParser     = require('body-parser'),
      flash          = require('connect-flash'),
      session        = require('express-session'),
      moment         = require('moment'),
      passport       = require('passport');

var indexRoutes     = require("./routes/index"),
    blogRoutes      = require("./routes/blog"),
    categorieRoutes = require("./routes/categories"),
    articleRoutes   = require("./routes/articles");

// Passport Config
require('./config/passport')(passport);

const port  = process.env.PORT || 5000,
      dburl = process.env.DATABASEURL || "mongodb://localhost/blog";

var app = express();

// Connect to Mongoose
mongoose.connect(dburl)
  .then(() => console.log(`MongoDB Connected to ${dburl}...`))
  .catch(err => console.log(err));
mongoose.Promise = global.Promise;

// EJS Middleware
app.set("view engine", "ejs");

// Static assets middleware
app.use(express.static(__dirname+'/public'));

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Method Overrode Middleware
app.use(methodOverride("_method"));

// Session Middleware
app.use(session({
  secret: 'my secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Middleware
app.use(flash());

// Middleware for logging activity
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  next();
});

// Middleware for globals
app.use((req, res, next) => {
    // auto current year in footer
    res.locals.currentYear = new Date().getFullYear();
    // Flash messages globals
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    // moment js
    res.locals.moment = moment;
    // url
    res.locals.fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    // user
    res.locals.user = req.user || null;
    next();
});

// Routes
app.use("/",indexRoutes);
app.use("/",blogRoutes);
app.use("/admin/categories", categorieRoutes),
app.use("/admin/articles", articleRoutes);

// Running server
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

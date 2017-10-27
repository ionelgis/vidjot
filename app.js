const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//initialeze express app
const app = express();

// load routes
const ideas = require('./routes/ideas');

// load users
const users = require('./routes/users');

//map global promise -get rid of mongose warning
mongoose.Promise = global.Promise;

//conect to mongodbwith mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useMongoClient: true
})
  .then(()=>{
    console.log('mongodb connected');
  })
  .catch(error => console.log(error));



//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

// method override middleware
app.use(methodOverride('_method'))

// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
//connect-flash middleware
app.use(flash());

//global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

//index route
app.get('/', (req, res)=>{
  const title = 'Welcome!!'
  res.render("index", {title: title});
});



//about route
app.get('/about', (req, res)=>{
  res.render('about');
});




//use idea routes
app.use('/ideas', ideas);

//use users routes
app.use('/users', users);

// set port
const port = 5000;

//app listens for reqests on port
app.listen(port, ()=>{
  console.log(`Server started on port ${port}` );
});
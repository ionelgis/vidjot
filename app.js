const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//initialeze express app
const app = express();

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

// load Idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

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

//idea index route
app.get('/ideas', (req, res)=>{
  Idea.find({})
  .sort({date: 'desc'})
  .then(ideas => {
    res.render('ideas/index', {ideas: ideas});
  })
  
});

//add idea route
app.get('/ideas/add', (req, res)=>{
  res.render("ideas/add");
});

//edit idea form
app.get('/ideas/edit/:id', (req, res)=>{
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea: idea
    });
  })
  
});

//Process form
app.post('/ideas', (req, res)=>{
 let errors = [];
 if (!req.body.title){
   errors.push({text: "Please add a title"});
 }
 if (!req.body.details){
  errors.push({text: "Please add details"});
}

if(errors.length > 0){
  res.render('ideas/add', {
    errors: errors,
    title: req.body.title,
    details: req.body.details
  })
} else{
  const newUser = {
    title: req.body.title,
    details: req.body.details
  }
  new Idea(newUser)
  .save()
  .then(idea => {
    req.flash('success_msg', 'Video idea added');
    res.redirect('/ideas')
  }) 
}

});


//edit form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id:req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then(idea => {
      req.flash('success_msg', 'Video idea updated');
      res.redirect('/ideas');
    })
  })
})

//Delete idea
app.delete('/ideas/:id', (req, res) =>{
  Idea.remove({
    _id: req.params.id
  }).then(() =>{
    req.flash('success_msg', 'Video idea removed');
    res.redirect('/ideas');
  })
})

// set port
const port = 5000;

//app listens for reqests on port
app.listen(port, ()=>{
  console.log(`Server started on port ${port}` );
});
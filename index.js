if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
  const express = require('express');
  const path = require('path');
  const mongoose = require('mongoose');
  const ejsMate = require('ejs-mate');
  const session = require('express-session');
  const flash = require('connect-flash');
  const AppError = require('./utils/AppError'); 
  const mongooseSanitize = require('express-mongo-sanitize');
  const methodOverride = require('method-override');
  const passport = require('passport');
  const localStrategy = require('passport-local');
  const cors=require('cors');
  const User = require('./models/user');
  
  const uri ='mongodb+srv://yelpcamp:hhNXPvbwPrhQWk2y@campgroundcluster.bafm8mz.mongodb.net/?retryWrites=true&w=majority&appName=campgroundCluster';
  const routerRegister = require('./routers/users');
  const routerCampground = require('./routers/campgrounds');
  const routerViews = require('./routers/reviews');
  const helmet = require('helmet');


// this is our MongoDB database

mongoose.Promise = global.Promise;

// connects our back end code with the database
mongoose.connect(uri,
    {   
    });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));


  
  
  const app = express();
  
  app.engine('ejs', ejsMate);
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride('_method'));
  app.use(express.static(path.join(__dirname, 'public')));
  
  const secret = process.env.SECRET||'thisismysecretcode';
   
  const sessionConfig = {
  
    secret:secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      // secure: true, // Enable for production
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  };
  const corsConfig={
    origin:'*',
    credential:true,
    methods:["GET","POST","PUT","DELETE"]
  };
  app.use(cors(corsConfig));
  app.use(session(sessionConfig));
  app.use(flash());
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new localStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  app.use(mongooseSanitize());
  
  app.use((req, res, next) => {
    
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  });
  
  app.use('/campgrounds', routerCampground);
  app.use('/', routerRegister);
  app.use('/campgrounds/:id/reviews', routerViews);
  

  
  app.all('*', (req, res, next) => {
    next(new AppError('Not page found!', 400));
  });
  
  app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('error', { err });
  });
  const port=process.env.Port;
  
  app.listen(port,() => {
    console.log("The port 600 is listening ....");
  });
  //mongodb+srv://yelpcamp:<password>@campgroundcluster.bafm8mz.mongodb.net/?retryWrites=true&w=majority&appName=campgroundCluster
  //mongodb+srv://yelpcamp:<password>@campgroundcluster.bafm8mz.mongodb.net/

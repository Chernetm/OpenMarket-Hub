if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();

}



const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);
const mongooseSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const cors = require('cors');
const User = require('./models/user');
const AppError = require('./utils/AppError');

const app = express();
const port = process.env.PORT || 600;

// MongoDB URI
const uri = "mongodb+srv://yelpcamp:hhNXPvbwPrhQWk2y@campgroundcluster.bafm8mz.mongodb.net/?retryWrites=true&w=majority&appName=campgroundCluster";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Middleware
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongooseSanitize());
app.use(helmet());
app.use(cors());
const secret = process.env.SECRET||'thisismysecretcode';

// Session Configuration
const sessionConfig = {
  secret: secret,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass user and flash messages to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
const campgroundRoutes = require('./routes/campgrounds');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('home');
});

// Error Handling
app.all('*', (req, res, next) => {
  next(new AppError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render('error', { err });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


















//   const express = require('express');
//   const path = require('path');
//   const mongoose = require('mongoose');
//   const ejsMate = require('ejs-mate');
//   const session = require('express-session');
//   const flash = require('connect-flash');
//   const AppError = require('./utils/AppError'); 
//   const mongooseSanitize = require('express-mongo-sanitize');
//   const methodOverride = require('method-override');
//   const passport = require('passport');
//   const localStrategy = require('passport-local');
//   const cors=require('cors');
//   const User = require('./models/user');
  
//   const uri ="mongodb+srv://yelpcamp:hhNXPvbwPrhQWk2y@campgroundcluster.bafm8mz.mongodb.net/?retryWrites=true&w=majority&appName=campgroundCluster";

//   const routerRegister = require('./routers/users');
//   const routerCampground = require('./routers/campgrounds');
//   const routerViews = require('./routers/reviews');
//   const helmet = require('helmet');


// // this is our MongoDB database

// mongoose.Promise = global.Promise;

// // connects our back end code with the database
// mongoose.connect(uri);

// const db = mongoose.connection;

// db.once('open', () => console.log('connected to the database'));


  
  
//   const app = express();
  
//   app.engine('ejs', ejsMate);
//   app.set('view engine', 'ejs');
//   app.set('views', path.join(__dirname, 'views'));
  
//   app.use(express.urlencoded({ extended: true,limit:"50mb"}));
//   app.use(methodOverride('_method'));
//   app.use(express.static(path.join(__dirname, 'public')));
  
//   const secret = process.env.SECRET||'thisismysecretcode';
   
//   const sessionConfig = {
  
//     secret:secret,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       httpOnly: true,
//       // secure: true, // Enable for production
//       expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//     },
//   };
//   const corsConfig={
//     origin:'*',
//     credential:true,
//     methods:["GET","POST","PUT","DELETE"]
//   };
//   app.use(cors(corsConfig));
//   app.use(session(sessionConfig));
//   app.use(flash());
//   app.use(helmet({
//     contentSecurityPolicy: false,
//   }));
  
//   app.use(passport.initialize());
//   app.use(passport.session());
//   passport.use(new localStrategy(User.authenticate()));
//   passport.serializeUser(User.serializeUser());
//   passport.deserializeUser(User.deserializeUser());
//   app.use(mongooseSanitize());
  
//   app.use((req, res, next) => {
    
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
//   });
  
//   app.get('/',(req,res)=>{
//     res.render('home');
//   })
//   app.use('/campgrounds', routerCampground);
//   app.use('/', routerRegister);
//   app.use('/campgrounds/:id/reviews', routerViews);

 
//   app.all('*', (req, res, next) => {
//     next(new AppError('Not page found!', 400));
//   });
  
//   app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = "Something went wrong";
//     res.status(statusCode).render('error', { err });
//   });
//   const port=process.env.Port;
  
//   app.listen(port,() => {
//     console.log(`The port ${port}is listening ....`);
//   });
  //mongodb+srv://yelpcamp:<password>@campgroundcluster.bafm8mz.mongodb.net/?retryWrites=true&w=majority&appName=campgroundCluster
  //mongodb+srv://yelpcamp:<password>@campgroundcluster.bafm8mz.mongodb.net/

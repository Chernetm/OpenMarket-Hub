
const MongoDBStore = require('connect-mongo')(session);
const store = new MongoDBStore({
  mongoUrl: uri,
  secret: process.env.SECRET || 'thisismysecretcode',
  touchAfter: 24 * 60 * 60, // Time interval in seconds for session update
});

store.on('error', function (e) {
  console.log("SESSION STORE ERROR", e);
});

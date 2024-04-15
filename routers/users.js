const express=require('express');
const router=express.Router();
const passport=require('passport');

const catchAsync=require('../utils/catchAsync');


const user=require('../controllers/users')

const authenticateUser = passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login' });
router.route('/register')
      .get(user.renderRegister)
      .post(catchAsync(user.register));

router.route('/login')
    .get(user.renderLogin)
    .post(authenticateUser,user.login);


  

router.get('/logout',user.logout );
router.get('/home',user.home);
router.get('/about',user.about);

module.exports=router;

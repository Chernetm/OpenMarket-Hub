const User=require('../models/user');
module.exports.renderRegister=(req,res)=>{
    res.render('users/register');

}
module.exports.home=(req,res,next)=>{
    res.render('home')
}
module.exports.about=(req,res)=>{
    res.render('about')
}
module.exports.register=async(req,res,next)=>{
    try{
        const{username,email,password}=req.body;
        const user=new User({username,email});
        const registeredUser=await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) {return next(err)};
            req.flash('success','Welcome to OpenMarket Hub');
            res.redirect('/campgrounds');
        })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');

    }
}
module.exports.renderLogin=(req, res) => {
    res.render('users/login')
    
    
}
module.exports.login = (req, res) => {
    
    req.flash('success', 'Welcome back to OpenMarket Hub!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo; // Corrected line
    res.redirect(redirectUrl);
}



module.exports.logout=(req, res) => {
    req.logout(function(err) {
        if(err) {
            console.error("Error while logging out:", err);
            return next(err);
        }
        

        req.flash('success', 'GoodBye');
        res.redirect('/campgrounds');
    });

}



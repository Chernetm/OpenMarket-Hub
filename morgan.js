const express=require('express');
const morgan =require('morgan');
const AppError=require('./AppError');

const app=express();

app.use(morgan('common'))//dev,tiny,common can be used instead of dev.
// app.use((req,res,next)=>{
//     console.log('This is the first middleware')
//     return next();
//     console.log("This is the first middleware- after calling first middleware")
// })
// app.use((req,res,next)=>{
//     console.log("This the second middleware");
//     next();
// })

app.use((req,res,next)=>{
    req.requestTime=Date.now();
    console.log(req.method,req.path.toUpperCase())
    next();
})
const verifyPassword=(req,res,next)=>{
    const{password}=req.query;
    if(password==="never"){
        next();
    }
    throw new AppError("Oh you need the password")

}
    

app.use('/cat',(req,res,next)=>{
    res.send("Meow Meow")
})
app.use('/cat',(req,res,next)=>{
    console.log("This cat middleware")
    next();
})
app.get('/secret',verifyPassword,(req,res)=>{
    res.send("My secret is I don't like to watch a movies and spare my time on unimportant thing. ")
})
app.get('/cat',(req,res)=>{
    console.log(req.requestTime)
    res.send("Meow")
})
app.get('/admin',(req,res)=>{
    throw new AppError("You're not admin",403)
})
app.get('/dog',(req,res)=>{
    res.send("Woof")
})
app.get('/error',(req,res)=>{
    CharacterData.fly()
    throw new AppError("OH please search it again",403)
})
app.use((err,req,res,next)=>{
   const{status=500, message="Something going wrong"}=err;
    res.status(status).send(message);
})
app.listen(700,()=>{
    console.log("The server connection with port 700...")
})
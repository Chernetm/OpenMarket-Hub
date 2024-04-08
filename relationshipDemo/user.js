const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/demo')
.then(open=>{
    console.log("MongoDB is connected")
}).catch(err=>{
    console.log("MongoDB is disconnected")
    
})

const userSchema= new mongoose.Schema({
    first:String,
    last:String,
    address:[
        {   _id:false,
            state:String,
            country:String,
            city:String,
            street:String,
        }
    ]
})
const user=mongoose.model('user',userSchema);


// const makeUser=async()=>{
//     const u=new user({
//         first:"chernet",
//         last:"Mekuira"

//     })
//     u.address.push({
        
//         state:"New York",
//         country:"USA",
//         city:"Amesterdam",
//         street:"Washington Dc",

//     })
//     const res=await u.save();
//     console.log(res);
// }
// makeUser();

const func=async(id)=>{
    const use= await user.findById(id);
    use.address.push({
        state:"London",
        city:"Arsenal",
        country:"United Kingdom",
        street:"Arsenal68",
    })
   const result= await use.save();
   console.log(result);
}
func('65fa4e25322ee22c2881414e');

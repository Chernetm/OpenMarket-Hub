const mongoose=require('mongoose');
const{Schema}=mongoose;
mongoose.connect('mongodb://localhost:27017/demo')
.then(open=>{
    console.log("MongoDB is connected")
}).catch(err=>{
    console.log("MongoDB is disconnected")
    
})



const productSchema=new Schema({
    name:String,
    price:Number,
    season:{
        type:String,
        enum:['summer','winter','spring']
    }
    
})
const product= mongoose.model('product',productSchema);
const farmSchema=new Schema({
    name:String,
    city:String,
    products:[{
        type:Schema.Types.ObjectId, ref:'product'
    }]
})
const farm=mongoose.model('farm',farmSchema);
const make=async()=>{
    const f= await farm.findOne({name:"Mekuira"});
    const p= new product({
        name:"Kocho",
        price:673,
        season:"summer",
    });
   f.products.push(p);
   await f.save();
    console.log(f)
}

const run=async()=>{
     const t=await farm.findOne({name:'Mekuira'}).populate('products','name')
     console.log(t)
    
}
run();


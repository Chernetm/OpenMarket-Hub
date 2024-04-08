
const mongoose=require('mongoose');
const Campground=require('../models/campground');
const cities=require('./cities');
const {descriptors,places}=require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(open=>{
    console.log("MongoDB is connected")
}).catch(err=>{
    console.log("MongoDB is disconnected")
    
})
const sample=array=>array[Math.floor(Math.random()*array.length)];
const seedDB= async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<25;i++){
        const rand=Math.floor(Math.random()*1000);
        const c=new Campground({
           images: [
            {
              url: 'https://res.cloudinary.com/dsa1gjnyd/image/upload/v1711826685/YelpCamp/qmcnz3bp8bkbu3ubksdo.jpg',
              filename: 'YelpCamp/qmcnz3bp8bkbu3ubksdo',
              
            },
            {
              url: 'https://res.cloudinary.com/dsa1gjnyd/image/upload/v1711826689/YelpCamp/kuqa9kqhhnn28oybffg3.jpg',
              filename: 'YelpCamp/kuqa9kqhhnn28oybffg3',
              
            },
            {
              url: 'https://res.cloudinary.com/dsa1gjnyd/image/upload/v1711826690/YelpCamp/zz87ch7nkb3mpxeuei98.jpg',
              filename: 'YelpCamp/zz87ch7nkb3mpxeuei98',
              
            },
            {
              url: 'https://res.cloudinary.com/dsa1gjnyd/image/upload/v1711826691/YelpCamp/swqx3lhyga47biksfnlx.jpg',
              filename: 'YelpCamp/swqx3lhyga47biksfnlx',
              
            }
          ],
            location:`${cities[rand].city},${cities[rand].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            author: '6604397d88d64ae31e3b00cf',
            description:"This image from unsplash flush website "

        });
    await c.save();
    }
    
}
seedDB().then(()=>{
    mongoose.connection.close();
})
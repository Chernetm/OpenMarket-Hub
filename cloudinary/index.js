const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');

// cloudinary.config({
//     cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
//     api_key:process.env.CLOUDINARY_KEY,
//     api_secret:process.env.CLOUDINARY_SECRET
// });
cloudinary.config({
    cloud_name: 'dsa1gjnyd',
    api_key: '627877728781181',
    api_secret: 'DlZ53HZr3Dr7WT1tf3RCcGzew_Y'
  });

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'YelpCamp',
        allowedFormats:['jpeg','png','jpg']
    }
    
});
module.exports={
    cloudinary,
    storage
}
          

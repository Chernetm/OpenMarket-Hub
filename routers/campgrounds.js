const express=require('express')
const router=express.Router();
const campground=require('../controllers/campgrounds')
const catchAsync=require('../utils/catchAsync');
const {isLoggedIn,validateCampground,isAuthor}=require('../middleware');


const multer=require('multer');
const{storage}=require('../cloudinary');
//const upload=multer({storage});
const upload = multer({
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
   fileFilter: (req, file, cb) => {
     // Validate file type if needed (e.g., image/jpeg)
     // Example: Allow only JPEG images
     if (file.mimetype.startsWith('image/')) {
       cb(null, true); // Accept the file
     } else {
       cb(new Error('Only images are allowed!'), false); // Reject the file
     }
   }
 });


router.route('/')
   .get(catchAsync(campground.index))
   .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campground.createCampground));
   
router.get('/new',isLoggedIn,catchAsync(campground.renderNewForm))
router.route('/:id')
   .get(catchAsync(campground.showCampground))
   .put(isLoggedIn, upload.array('image'),isAuthor,validateCampground,catchAsync(campground.updateCampground))
   .delete(isLoggedIn,isAuthor,catchAsync(campground.deleteCampground))

router.get('/:id/edit', isLoggedIn,isAuthor,catchAsync(campground.renderEditForm))


module.exports=router;
//
const express=require('express')
const router=express.Router();
const campground=require('../controllers/campgrounds')
const catchAsync=require('../utils/catchAsync');
const {isLoggedIn,validateCampground,isAuthor}=require('../middleware');


const multer=require('multer');
const{storage}=require('../cloudinary');

const upload = multer({
   storage: storage,
   limits: { fileSize: 2 * 1024 * 1024 } // 2MB file size limit
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
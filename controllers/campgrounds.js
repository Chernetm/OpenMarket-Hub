const campground=require('../models/campground');
const{cloudinary}=require('../cloudinary');
const {AppError}=require('../utils/AppError')
module.exports.index=async(req,res,next)=>{
    
    const campgrounds= await campground.find({});
    res.render('campgrounds/index',{campgrounds})
};
module.exports.renderNewForm=async(req,res,next)=>{
    res.render('campgrounds/new')
   
}
module.exports.createCampground=async(req,res,next)=>{
    //if(!req.body.campground) throw new routerError('Invalid campground',400)

    const newCamp=new campground(req.body.campground);
    newCamp.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    newCamp.author=req.user._id;
    await newCamp.save();

    req.flash( 'success', 'Successfully made a new product');
    res.redirect(`/campgrounds/${newCamp._id}`);
}



module.exports.showCampground=async(req,res,next)=>{
    const campgrounds=await campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }
    ).populate('author');
    
    if(!campgrounds){
        req.flash('error','Could not found this product');
        return res.redirect('/campgrounds');
    }
    //if(!campgrounds) throw new AppError('Not found Campgrounds')
    res.render('campgrounds/show',{campgrounds})
}

module.exports.renderEditForm=async(req,res,next)=>{
    
    const campgrounds= await campground.findById(req.params.id);
    if(!campgrounds){
        req.flash('error','Could not found this product');
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit',{campgrounds});
}
// module.exports.updateCampground=async(req,res,next)=>{
//     const{id}=req.params;
//     const campgrounds=await campground.findByIdAndUpdate(id,{...req.body.campground});
//     const imgs=req.files.map(f=>({url:f.path, filename:f.filename}));
//     campgrounds.images.push(...imgs);
//     await campgrounds.save();

//     if(req.body.deleteImages){
//         console.log(req.body.deleteImages);
//         for(let filename of req.body.deleteImages){
//             await cloudinary.uploader.destroy(filename);
//         }
//         await campgrounds.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
//     }

//     req.flash('success','Successfully updated product');
//     res.redirect(`/campgrounds/${campgrounds._id}`);
      
      
//   }


module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;

    try {
        const campgrounds = await campground.findByIdAndUpdate(id, { ...req.body.campground });
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        campgrounds.images.push(...imgs);
        await campgrounds.save();

        if (req.body.deleteImages) {
            // Trim whitespace from each filename in deleteImages array
            const filenamesToDelete = req.body.deleteImages.map(filename => filename.trim());
            
            console.log(filenamesToDelete); // Debugging output

            for (let filename of filenamesToDelete) {
                // Delete image from Cloudinary
                await cloudinary.uploader.destroy(filename);
            }
            
            // Remove deleted images from campground's images array in database
            await campgrounds.updateOne({ $pull: { images: { filename: { $in: filenamesToDelete } } } });
        }

        req.flash('success', 'Successfully updated product');
        res.redirect(`/campgrounds/${campgrounds._id}`);
    } catch (err) {
        console.error('Error updating campground:', err);
        req.flash('error', 'Failed to update campground');
        res.redirect(`/campgrounds/${id}`); // Redirect back to campground edit page with error
    }
};


// module.exports.deleteCampground=async(req,res,next)=>{
//     const{id}=req.params;
//     const foundedCamp=await campground.findById(id);
//     await campground.findByIdAndDelete(id);
//     await cloudinary.uploader.destroy(foundedCamp.images.filename)
//     req.flash('success','Successfully deleted campground.')
//     res.redirect('/campgrounds');
// }
module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    try {
        const foundedCamp = await campground.findById(id);
        await campground.findByIdAndDelete(id);
        
        // Assuming `foundedCamp.images` is an array of objects with `public_id`
        for (const image of foundedCamp.images) {
            await cloudinary.uploader.destroy(image.filename);
        }

        req.flash('success', 'Successfully deleted product.');
        res.redirect('/campgrounds');
    } catch (err) {
        // Handle errors appropriately, maybe send an error response
        next(err);
    }
}


/**API ID:wn5GBbuz2lKNm182hEth
 API KEY:h4B4g9wE1NNINCYhbMcvWzKX9JucyRNDJ8JXkhm72Jg
*
*/
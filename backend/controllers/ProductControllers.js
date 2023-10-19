const Product =require("../models/productModel") ;
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApifFeatures = require("../utils/apifeatures");

//get ALl  prduct

const getAllProducts = catchAsyncErrors(async(req,res)=>{


    const resultPerPage = 5 ;

    const ProductCount =await Product.countDocuments() ;
    
    const apifFeatures = new ApifFeatures (Product.find(),req.query).search().filter().pagination(resultPerPage)

    const products =await apifFeatures.query ;
    res.status(201).json({
        success:true ,
        products ,
        ProductCount
    })
})

//get Product Details

const getproductDetails = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product)
    {
       return next(new ErrorHandler("Product not found",404)) ;

    }
    res.status(200).json({
        Sucess:true ,
        product
    })

})      


//create Product --ADMIN
const createProduct =catchAsyncErrors(async(req,res,next)=>{

    req.body.user = req.user.id

    const product=await Product.create(req.body) ;
    res.status(201).json({
        success:true ,
        product 
    })

})

//update product 

const updateProduct =catchAsyncErrors(async(req,res,next)=>{
   
    let product = await Product.findById(req.params.id);

    if(!product)
    {
       return next(new ErrorHandler("Product not found",404)) ;

    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true ,      
        runValidators:true ,
        useFindAndModify:false
    }) ;

    res.status(200).json({
        success:true ,
        product 
    })

}
)
//delete products 

const deleteProducts =catchAsyncErrors(async(req,res)=>{

    try{
        const deletep = await Product.findByIdAndDelete(req.params.id) ;
    
        if(!req.params.id)
        {
           return res.status(400).send() ;

        }
        res.send(deleteP) 
 
    }catch(e){
        res.status(500).send(e) ;
    }


})
    //create new review or update the review 
    const createProductReview =catchAsyncErrors(async(req,res,next)=>{
        
        const {rating ,comment ,productId }= req.body ;

        const review ={
            user :req.user.id ,
            name:req.user.name ,
            rating :Number(rating),
            comment
        }
        const product =await Product.findById(productId) ;

        const isreviewd =product.reviews.find(rev=>rev.user.toString()===req.user._id.toString()) ;

        
        if(isreviewd){
            product.reviews.forEach(rev=>{
                if(rev=>rev.user.toString()===req.user._id.toString())
                rev.rating =rating ,
                rev.comment =comment ;
            })
 
        }
        else
        {
            product.reviews.push(review) ;
            product.numofRev =product.reviews.length  
        }
        //

            let avg = 0 ;

            product.reviews.forEach(rev=>
            {
                avg +=rev.rating ;
            }) 

            product.ratings =avg/product.reviews.length ;

            await product.save({validateBeforeSave:false}) ;

            res.status(200).json({
                success:true ,

            })

    })
//get all Reviews of a product 

const getProductReviews =catchAsyncErrors(async(req,res,next)=>
{
    const product =await Product.findById(req.query.id) ;
    if(!product)
    {
        return next(new ErrorHandler("Product not found",404))  ;


    }
    res.status(200).json({
        sucess:true ,
        reviews:product.reviews ,
    })

})
//delete reviews

const deletReviews =catchAsyncErrors(async(req,res,next)=>
{
    const product =await Product.findById(req.query.productId) ;
    if(!product)
    {
        return next(new ErrorHandler("Product not found",404))  ;

    }
    const reviews=product.reviews.filter(rev=>rev._id.toString()!== req.query.productId.toString()) ;
    let avg = 0 ;
    reviews.forEach(rev=>
    {
        avg +=rev.rating ;
    }) 

   const  ratings =avg/reviews.length ;

    const numofReviews =reviews.length ;

    await product.findByIdAndUpdate(req.query.productId,{
        reviews ,
        ratings ,
        numofReviews ,
    },{
        new:true ,
        runValidators:true ,
        useFindAndModify:false ,
    })
    res.status(200).json({
        sucess:true ,
        reviews:product.reviews ,
    })

})
module.exports={getAllProducts,createProduct,updateProduct,deleteProducts,getproductDetails ,createProductReview ,getProductReviews ,deletReviews} ;
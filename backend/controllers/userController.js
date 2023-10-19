const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const User =require("../models/usermodels") ;
const sendToken = require("../utils/jwtTokens");
const sendEmail =require("../utils/sendEmail")
const crypto =require("crypto")

//register a user 

const registerUser =catchAsyncErrors(async(req,res,next)=>{

    const {name,email,password} =req.body ;


    const user =await User.create({
        name,email ,password ,
        avatar:{
            public_id:"this is sample id " ,
            url:"profilepic1 "
        } 
    })

    // const token =user.getJWTToken()
    // res.status(201).json({
    //     sucess:true ,
    //     token ,
    // })

    sendToken(user,201,res) ; //short form for above snippets

})
//login USer

const loginuser =catchAsyncErrors(async(req,res,next) =>{


    const {email,password} =req.body ;
    //checking if user has given password and email both 

      if(!email || !password){

        return next(new ErrorHandler("please Enter Email & password",400)) ;
    
    }
    
      const user = await User.findOne({email}).select("+password");
    
      if(!user){
        return next( new ErrorHandler("Invalid email or password"),401) ;

      }


       const isPasswordMatched =  user.comparePassword(password) ;

    if(!isPasswordMatched)
    {
        return next(new ErrorHandler("invalid Email or password"),401) ;

    }
    // const token =user.getJWTToken()
    // res.status(200).json({
    //     sucess:true ,
    //     token ,
    // })
    
    sendToken(user,200,res) ;//short form for above snippets

 })

 //logout

  const logout =catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()) ,
        httpOnly:true

    })

    res.status(200).json({
        success:true ,
        message :"Logged out" ,

    }) ;


  })
  //forgetPassword

   const forgetPassword =catchAsyncErrors(async(req,res,next)=>
   {
         const user =await User.findOne({email:req.body.email}) ;

         if(!user)
         {
            return next(new ErrorHandler("user not found ",404)) 
         }
         //get reset password token 

        const resetToken =  user.getResetPasswordToken() ;

        await user.save({validateBeforeSave:false} );

        const resetPasswordUrl =`${req.protocol}://${req.get("host")}/api/password/reset/${resetToken}` ;

        const message =`your password reset token is :- \n\n ${resetPasswordUrl}\n\n if you have not requested this email then , please ignore it ` ;


        try{


            await sendEmail({

                email: user.email ,
                subject :`Ecommerce password Recovery ` ,
                message ,


            });

            res.status(200).json({
                success:true ,
                message:`Email sent to ${user.email} succesfully ` ,

            })

        }catch(error)
        {
            user.resetPasswordToken =undefined ;
            user.resetPasswordExpire =undefined ;

            await user.save({validateBeforeSave:false} );

            return next(new ErrorHandler(error.message,500)) ;



        }



   })

   const resetPassword =catchAsyncErrors(async(req,res,next)=>{
    // creating token hash 
    const resetPasswordToken= crypto.createHash("sha256").update(req.params.token).digest("hex") ;

    const user =await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt :Date.now()}})
     
    if(!user)
    {
       return next(new ErrorHandler("Reset password token is invalid or has been expired ",400))  ;

    }
    if(req.body.password !== req.body.confirmpassword)
    {
       return next(new ErrorHandler("password does not password ",400)) 
    }
    user.password =req.body.password ;
    user.resetPasswordToken =undefined ;
    user.resetPasswordExpire =undefined ;
    
    await user.save() ;
    sendToken(user,200,res) ;

     
   })

   //get user details

   const getuserdetails=catchAsyncErrors(async(req,res,next)=>
   {
     const user = await User.findById(req.user.id) ;
      

     res.status(200).json({
        success:true ,
        user ,
     })
   })

   //update user password

   const updatepasssword =catchAsyncErrors(async(req,res,next)=>
   {
     const user = await User.findById(req.user.id).select( "+password");
     

     const isPasswordMatched =await user.comparePassword(req.body.oldpassword) ;

     if(!isPasswordMatched)
     {
        return next(new ErrorHandler("old password is incorrect ",400)) ;

     }
     if(req.body.newpassword!== req.body.confirmpassword)
     {
        return next(new ErrorHandler("Password does not matched "),400) ;

     }
      
     user.password = req.body.newpassword ;
     user.save() ;
     sendToken(user,200,res) ;

   })

   //update user profile

   const updateprofile =catchAsyncErrors(async(req,res,next)=>
   {

     const newUserData ={
        name:req.body.name ,
        email:req.body.email ,

     }

    //we will addd cloudenary later
        const user = await User.findByIdAndUpdate(req.User.id, newUserData,{
        new :true ,
        runValidators:true ,
        useFindAndModify :false ,
    }) ;
    res.status(200).json({
        success:true 
    })

   })

   //Get all Users(admin)

   const getAllUsers =catchAsyncErrors(async(req,res,next)=>
   {
    const user =await User.find() ;
    res.status(200).json({
        sucess:true ,
        user ,
    })

   })

   //get single user (admin)
   const getSingleUsers =catchAsyncErrors(async(req,res,next)=>
   {
    const user =await User.findById(req.params.id) ;

    if(!user)
    {
       return next(new ErrorHandler(`User does not exists with id ${req.params.id}`)) ;

    }


    res.status(200).json({
        sucess:true ,
        user ,
    })

   })
   
    //update user role --admin
     const updateRole = catchAsyncErrors(async(req,res,next)=>
     {  
        const newUSerData ={
            name:req.body.name ,
            email:req.body.email ,
            role:req.body.role ,

        }
        //we will add clodenary later 

        const user =await User.findByIdAndUpdate(req.params.id,newUSerData,{
            new:true ,
            runValidators:true ,
            userFindAndModify :false ,

        }) ;
        res.status(200).json(
            {
                sucess:true ,
            }) ;

            user.resetPasswordToken =undefined ;
            user.resetPasswordExpire =undefined ;
            await user.save() ;


     })

    //delete user --admin
    const deleteUser =catchAsyncErrors(async(req,res,next)=>
    {

        const user =await User.findByIdAndRemove(req.params.id) ;

        if(!user)
        {
            return next( new ErrorHandler(`user does not exists with id ${req.params.id}`))
        }

        res.status(200).json({
         success:true ,
         message:"user delete Successfully" ,
        })
 
    })






module.exports ={registerUser,loginuser,logout,forgetPassword,resetPassword,getuserdetails,updatepasssword,updateprofile,getAllUsers,getSingleUsers,deleteUser,updateRole} 
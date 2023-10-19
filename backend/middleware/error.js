const ErrorHandler=require("../utils/errorhandler" ) ;

module.exports =(err ,req,res ,next )=>{

    err.statusCode =err.statusCode||500  ;
    err.message =err.message || "internal service error " ;
    

    //Wrong MOngodb d error 

    if(err.name=== "castError"){
        const message =`Resources not found. Invalid :${err.path} ` ;
        err =new ErrorHandler(message ,400 ) ;
    }
    //mongoose dupulicate key error

    if(err.code ===1100)
    {
        const message =`Duplicate ${object.keys(err.keyvalue)} Enterd `
    }
      //Wrong jsonwebtoken  error 

      if(err.name=== "jsonwebTokenError"){
        const message =`Json web token is invalid please try again` ;
        err =new ErrorHandler(message ,400 ) ;
    }
    //jwtexpire error 

    if(err.name=== "TokenExpiredError"){
        const message =`Json web token is expired please try again` ;
        err =new ErrorHandler(message ,400 ) ;
    }


    res.status(err.statusCode).json({
        sucess:false ,
        message : err.message,
    })

}
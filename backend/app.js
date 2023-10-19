const express =require("express") ;

const errorMiddleware = require("./middleware/error") ;
const cookieParser =require("cookie-parser" ) ;


const app =express() ;
app.use(express.json()) ;
app.use(cookieParser()) ;
 
//route imports l

const product =require("./routes/productroute"); 

const user =require("./routes/userRoutes") ;
const order =require("./routes/orderRoutes") ;


app.use("/api",order) ;
app.use("/api",user) ;
app.use("/api",product) ;



//middleware for error 
app.use(errorMiddleware) ;


module.exports = app




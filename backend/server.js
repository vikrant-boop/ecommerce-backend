const app= require("./app") ;
const router = require("./routes/productroute");
const dotenv =require("dotenv") ;
const connectDatabase =require("./config/database") ;


//handling unquote exception4

process.on("uncaughtexception",(err)=>{
    console.log(` Error : ${err.message}`) ;
    console.log(`Shutting down the server due to uncaught Exeption`) ;
    process.exit(1) ;
    

})


//config
dotenv.config({path:"backend/config/config.env"}) ;

//coonnecting database
connectDatabase()

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
}) 

//unhandled Promise rejection 

process.on("unhandledRejection",error=>{
    console.log(` Error : ${err.message}`) ;
    console.log(`Shutting down the server due to Unhandeled promise Rejection `) ;
    server.close(()=>{
        process.exit(1) ;
    })
})
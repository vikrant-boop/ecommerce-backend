const mongoose =require("mongoose") ;

const connectDatabase =()=>{
    mongoose.connect("mongodb+srv://mahajanvikrant1704:Vikrant1122@cluster0.fofylw7.mongodb.net/ecommers?retryWrites=true&w=majority").then((data)=>{

        console.log(`Mongodb coonectd with server: ${data.connection.host}`) ;
    
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports = connectDatabase 









const Order =require("../models/orderModel") ;
const Product =require("../models/productModel") ;
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

 

const newOrder =catchAsyncErrors(async(req,res,next)=>
{
    const{shippingInfo ,orderItems ,paymentInfo ,itemsPrice ,taxPrice ,shippingPrice ,totalPrice} =req.body  ;

    const order =await Order.create(
        {shippingInfo ,
        orderItems ,
        paymentInfo ,
        itemsPrice ,
        taxPrice,
        shippingPrice ,
        totalPrice,
        paidAt:Date.now() ,
        user:req.user._id ,

        }) ;
        res.status(201).json({
            sucess:true ,
            order,
        })

})
//getsingle order 

 const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user","name email") ;
  
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
    res.status(200).json({
      success: true,
      order,
    });
  });

 //get logges in user  order 

const myOrders  = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
  
    res.status(200).json({
      success: true,
      orders,
    });
  });
  

//get all   order 

const getAllOrders  = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount =0 ;
    orders.forEach((order )=>{totalAmount += order.totalPrice} )
    res.status(200).json({
      success: true,
      totalAmount ,
      orders,
    });
  });

//update    order  status

const updateOrderStatus  = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order)
    {
        return next(new ErrorHandler("order not found with this Id " ,404)) ;

    }

    if(order.orderStatus==="Deliverd")
    {  
        return next( new ErrorHandler("You have already delived this order" ,400)) ;


    }
    order.orderItems.forEach(async(order)=>
        {
            await updateStock(order.Product ,order.quantity)
        })

    order.orderStatus =req.body.status ;

    if(req.body.status ==="Deliverd"){
         order.deliverdAt =Date.now() ;
    }
    await order.save({
        validateBeforeSave :false ,
    })
    res.status(200).json({
      success: true,

    });
  });

  async function updateStock (id ,quantity )
  {
    const product =await Product.findById(id) ;
    product.stock -= quantity
    await product.save(
        {
        validateBeforeSave:false
        }
    )
  }
  //delete  order 

const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.findOneAndRemove(req.params.id);
    if(!orders)
    {
        return next(new ErrorHandler("order not found with this Id " ,404)) ;

    }
  
    res.status(200).json({
      success: true,
    
    });
  });
  
module.exports = {newOrder ,getSingleOrder ,myOrders ,getAllOrders,updateOrderStatus ,deleteOrder} ;
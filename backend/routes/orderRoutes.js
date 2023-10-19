const express =require("express") ;
const router =express.Router() ;
const {newOrder, getSingleOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrder}=require("../controllers/orderControllers")
const {isAuthenticatedUSer ,authorizeRoles} = require("../middleware/auth");


router.route("/order/me").get(isAuthenticatedUSer,myOrders) ;
router.route("/order/:id").get(isAuthenticatedUSer ,getSingleOrder) ;
router.route("/order/new").post(isAuthenticatedUSer ,newOrder) ;
router.route("/admin/orders").get(isAuthenticatedUSer ,authorizeRoles("admin") ,getAllOrders)  ;
router.route("/admin/order/:id").put(isAuthenticatedUSer ,authorizeRoles("admin") ,updateOrderStatus) ;
router.route("/admin/order/:id").delete(isAuthenticatedUSer  ,authorizeRoles("admin") ,deleteOrder) ;



module.exports=router;
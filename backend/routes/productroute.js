const express =require("express") ;
const { getAllProducts ,createProduct,updateProduct,deleteProducts,getproductDetails ,createProductReview ,getProductReviews,deletReviews} = require("../controllers/ProductControllers");
const {isAuthenticatedUSer ,authorizeRoles} = require("../middleware/auth");
const router = express.Router() ;

router.route("/products").get( getAllProducts);
router.route("/admin/products/new").post(isAuthenticatedUSer,authorizeRoles("admin") ,createProduct);
router.route('/admin/products/:id').put(isAuthenticatedUSer,authorizeRoles("admin") , updateProduct) ;
router.route("/admin/products/:id").delete(isAuthenticatedUSer,authorizeRoles("admin"), deleteProducts) ;
router.route("/products/:id").get(getproductDetails) ;
router.route("/review").put(isAuthenticatedUSer,createProductReview) ;
router.route("/reviews").get(getProductReviews) ;
router.route("/reviews").delete( isAuthenticatedUSer,deletReviews)  ;

module.exports =router  ;
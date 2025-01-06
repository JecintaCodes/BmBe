import express, { Application, Request, Response, Router } from "express";
import OrderController, {
  createProduct,
  readProduct,
  readOneProduct,
  purchaseProduct,
  viewOrders,
  deleteProduct,
  createProductList,
  deleteProductList,
  viewUserProduct,
  readOrders,
  viewProductUser,
  viewAllLists,
  searchProducts,
  readOneUserOrders,
} from "../controller/productController";
import multer from "multer";
const upload = multer().single("image");
const app: Application = express();
const productRouter = Router();
console.log(upload);
productRouter.route("/:userID/register-products").post(upload, createProduct);
// const upload = multer().single("image");

app.post("/register-products", upload, (req: Request, res: Response) => {
  console.log("File received:", req.file); // Log the uploaded file
  console.log("Request body:", req.body); // Log the rest of the request data

  if (!req.file) {
    return res
      .status(400)
      .json({ message: "No file uploaded. Please include an image." });
  }

  res.status(200).json({ message: "File uploaded successfully" });
});

productRouter.route("/get-all-product").get(readProduct);
productRouter.route("/get-all-order").get(readOrders);
productRouter.route("/get-all-list").get(viewAllLists);
productRouter.route("/:productID/get-one-product").get(readOneProduct);
productRouter
  .route("/:userID/:productID/purchase-product")
  .post(purchaseProduct);
productRouter.route("/:userID/view-user-products").get(viewUserProduct);
productRouter.route("/:userID/view-products-user").get(viewProductUser);
productRouter.route("/:userID/view-orders").get(viewOrders);
productRouter.route("/:orderID/read-user-orders").get(readOneUserOrders);
productRouter.route("/:userID/:productID/delete-product").delete(deleteProduct);
productRouter.route("/:userID/create-list").post(createProductList);
productRouter.route("/:listID/delete-list").delete(deleteProductList);
productRouter.route("/search").get(searchProducts);
// import express, { Router } from "express";import OrderController from "../controllers/OrderController";

// const router: Router = express.Router();
const orderController = new OrderController();

// productRouter.get("/daily", async (req, res) => {
//   const dailyOrders = await orderController.getDailyOrders();
//   res.json(dailyOrders);
// });

productRouter.get("/monthly", async (req: Request, res: Response) => {
  const monthlyOrders = await orderController.getMonthlyOrders();
  res.json(monthlyOrders);
});

// productRouter.get("/yearly", async (req, res) => {
//   const yearlyOrders = await orderController.getYearlyOrders();
//   res.json(yearlyOrders);
// });

// export default productRouter;
export default productRouter;

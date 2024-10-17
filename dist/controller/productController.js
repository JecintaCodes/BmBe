"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductList = exports.deleteProductList = exports.viewLists = exports.deleteProduct = exports.viewOrders = exports.viewUserProduct = exports.purchaseProduct = exports.updateProducts = exports.readOneProduct = exports.readOrders = exports.readProduct = exports.createProduct = void 0;
const userMode_1 = __importDefault(require("../model/userMode"));
const productModel_1 = __importDefault(require("../model/productModel"));
const stream_1 = require("../utils/stream");
const mainError_1 = require("../error/mainError");
const mongoose_1 = require("mongoose");
const orderModel_1 = __importDefault(require("../model/orderModel"));
const listModel_1 = __importDefault(require("../model/listModel"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userID } = req.params;
        const { title, description, QTYinStock, amount } = req.body;
        const { secure_url } = yield (0, stream_1.streamUpload)(req);
        const user = yield userMode_1.default.findById(userID);
        if (user && user.role === "USER") {
            const product = yield productModel_1.default.create({
                userID: user === null || user === void 0 ? void 0 : user._id,
                postBy: user === null || user === void 0 ? void 0 : user.name,
                title,
                img: secure_url,
                QTYinStock,
                amount,
                description,
            });
            (_a = user === null || user === void 0 ? void 0 : user.myStore) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.Types.ObjectId(product === null || product === void 0 ? void 0 : product._id));
            user === null || user === void 0 ? void 0 : user.save();
            return res.status(mainError_1.HTTP.CREATED).json({
                message: `has succesfully created ${product.title} `,
                data: product,
            });
        }
        else {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: `you are not a user`,
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `Cannot create store: ${error}`,
        });
    }
});
exports.createProduct = createProduct;
const readProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.find();
        return res.status(mainError_1.HTTP.OK).json({
            message: "reading all the products",
            data: product,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `can't read data ${error} `,
        });
    }
});
exports.readProduct = readProduct;
const readOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orderModel_1.default.find();
        return res.status(mainError_1.HTTP.OK).json({
            message: "reading all the orders",
            data: order,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `can't read data ${error} `,
        });
    }
});
exports.readOrders = readOrders;
const readOneProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productID } = req.params;
        const product = yield productModel_1.default.findById(productID);
        return res.status(mainError_1.HTTP.OK).json({
            message: "gotten one product",
            data: product,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `cannot read one product ${error}`,
        });
    }
});
exports.readOneProduct = readOneProduct;
const updateProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productID } = req.params;
        const { QTYpurchased } = req.body;
        const product = yield productModel_1.default.findById(productID);
        if (product) {
            let viewProduct = yield productModel_1.default.findByIdAndUpdate(productID, { QTYinStock: product.QTYinStock - QTYpurchased }, { new: true });
            return res.status(mainError_1.HTTP.CREATED).json({
                message: "One product gotten",
                data: viewProduct,
            });
        }
        else {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: `error getting One product`,
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error getting One product ${error}`,
        });
    }
});
exports.updateProducts = updateProducts;
const purchaseProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productID, userID } = req.params;
        const { QTYOrder } = req.body;
        const product = yield productModel_1.default.findById(productID);
        if (product) {
            if ((product === null || product === void 0 ? void 0 : product.QTYinStock) > QTYOrder) {
                // purchase product
                const productOwner = yield userMode_1.default.findById(product === null || product === void 0 ? void 0 : product.userID);
                const productBuyer = yield userMode_1.default.findById(userID);
                // update store's quantity
                let viewProduct = yield productModel_1.default.findByIdAndUpdate(productID, { QTYinStock: product.QTYinStock - QTYOrder }, { new: true });
                const order = yield orderModel_1.default.create({
                    QTYOrder,
                    title: product.title,
                    productOwner: product.userID,
                    img: product.img,
                    description: product.description,
                    amountPaid: QTYOrder * product.amount,
                    address: productBuyer === null || productBuyer === void 0 ? void 0 : productBuyer.address,
                });
                // update entries
                productOwner === null || productOwner === void 0 ? void 0 : productOwner.order.push(new mongoose_1.Types.ObjectId(order === null || order === void 0 ? void 0 : order._id));
                productOwner === null || productOwner === void 0 ? void 0 : productOwner.save();
                productBuyer === null || productBuyer === void 0 ? void 0 : productBuyer.order.push(new mongoose_1.Types.ObjectId(order === null || order === void 0 ? void 0 : order._id));
                productBuyer === null || productBuyer === void 0 ? void 0 : productBuyer.save();
                return res.status(mainError_1.HTTP.CREATED).json({
                    message: "One product gotten",
                    data: viewProduct,
                });
            }
            else {
                return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                    message: `Purchase volume has to be lesser than or equal to what is left in our store`,
                });
            }
        }
        else {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: `error getting One product`,
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error getting One product ${error}`,
        });
    }
});
exports.purchaseProduct = purchaseProduct;
const viewUserProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userMode_1.default.findById(userID).populate({
            path: "myStore",
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
        if (user) {
            return res.status(mainError_1.HTTP.CREATED).json({
                message: "product updated",
                data: user,
            });
        }
        else {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: `this is not a product `,
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `can't update product ${error}`,
        });
    }
});
exports.viewUserProduct = viewUserProduct;
const viewOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const orders = yield userMode_1.default.findById(userID).populate({
            path: "orders",
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
        if (orders) {
            return res.status(mainError_1.HTTP.OK).json({
                message: "Orders retrieved",
                data: orders,
            });
        }
        else {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: `User not found or no orders`,
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `Error retrieving orders: ${error}`,
        });
    }
});
exports.viewOrders = viewOrders;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userID, productID } = req.params;
        const user = yield userMode_1.default.findById(userID);
        if (user) {
            const product = yield productModel_1.default.findById(productID);
            console.log(user === null || user === void 0 ? void 0 : user._id);
            console.log(product === null || product === void 0 ? void 0 : product.userID);
            if ((product === null || product === void 0 ? void 0 : product.userID) === (user === null || user === void 0 ? void 0 : user._id.toString())) {
                const deleteProduct = yield productModel_1.default.findByIdAndDelete(productID);
                (_a = user === null || user === void 0 ? void 0 : user.myStore) === null || _a === void 0 ? void 0 : _a.pull(new mongoose_1.Types.ObjectId(productID));
                user === null || user === void 0 ? void 0 : user.save();
                return res.status(mainError_1.HTTP.OK).json({
                    message: "product deleted",
                    data: deleteProduct,
                });
            }
            else {
                return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                    message: `this product does not belong to you `,
                });
            }
        }
        else {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: `you are not a user `,
            });
        }
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error deleting product ${error}`,
        });
    }
});
exports.deleteProduct = deleteProduct;
const viewLists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        const list = yield listModel_1.default.find({ title });
        return res.status(mainError_1.HTTP.OK).json({
            message: "all user gotten list",
            data: list,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error creating product ${error}`,
        });
    }
});
exports.viewLists = viewLists;
// export const getLists = async (req: Request, res: Response) => {
//   try {
//     const { userID } = req.params;
//     const list = await userModel.findById(userID).populate({
//       path: "lists",
//       options: {
//         sort: {
//           createdAt: -1,
//         },
//       },
//     });
//     return res.status(HTTP.OK).json({
//       message: "all user gotten list",
//       data: list,
//     });
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error creating product ${error}`,
//     });
//   }
// };
const deleteProductList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listID } = req.params;
        const list = yield listModel_1.default.findByIdAndDelete(listID);
        return res.status(mainError_1.HTTP.OK).json({
            message: "deleted list",
            data: list,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error creating product ${error}`,
        });
    }
});
exports.deleteProductList = deleteProductList;
const createProductList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { lists } = req.body;
        console.log("Request body:", req.body);
        console.log("User ID:", userID);
        if (!lists || !Array.isArray(lists)) {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: "Invalid request: lists array required",
            });
        }
        const user = yield userMode_1.default.findById(userID);
        if (user) {
            const createdLists = yield Promise.all(lists.map((list) => __awaiter(void 0, void 0, void 0, function* () {
                const newList = yield listModel_1.default.create({
                    title: list.title,
                    amount: list.amount,
                    userID: user._id,
                });
                return newList;
            })));
            // console.log("Created lists:", createdLists);
            yield user.updateOne({
                $push: { lists: { $each: createdLists.map((list) => list._id) } },
            });
            return res.status(mainError_1.HTTP.CREATED).json(createdLists);
        }
        else {
            return res.status(mainError_1.HTTP.BAD_REQUEST).json({
                message: `you are not a user`,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: "Internal Server Error",
        });
    }
});
exports.createProductList = createProductList;
// class OrderController {
//   async getDailyOrders() {
//     const dailyOrders = await orderModel.aggregate([
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
//           totalOrders: { $sum: 1 },
//         },
//       },
//       {
//         $sort: { _id: -1 },
//       },
//     ]);
//     return dailyOrders;
//   }
//   async getMonthlyOrders() {
//     const monthlyOrders = await orderModel.aggregate([
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
//           totalOrders: { $sum: 1 },
//         },
//       },
//       {
//         $sort: { _id: -1 },
//       },
//     ]);
//     return monthlyOrders;
//   }
//   async getYearlyOrders() {
//     const yearlyOrders = await orderModel.aggregate([
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y", date: "$date" } },
//           totalOrders: { $sum: 1 },
//         },
//       },
//       {
//         $sort: { _id: -1 },
//       },
//     ]);
//     return yearlyOrders;
//   }
// }
// export default OrderController;
// export const updateProductName = async (req: Request, res: Response) => {
//   try {
//     const { productID } = req.params;
//     const { title } = req.body;
//     const product = await productModel.findById(productID);
//     if (product) {
//       const updateProduct = await productModel.findByIdAndUpdate(
//         productID,
//         {
//           title,
//         },
//         { new: true }
//       );
//       return res.status(HTTP.CREATED).json({
//         message: "product updated",
//         data: updateProduct,
//       });
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `this is not a product `,
//       });
//     }
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `can't update product ${error}`,
//     });
//   }
// };
// export const updateProductTotal = async (req: Request, res: Response) => {
//   try {
//     const { productID } = req.params;
//     const { total } = req.body;
//     const product = await productModel.findById(productID);
//     if (product) {
//       const updateProduct = await productModel.findByIdAndUpdate(
//         productID,
//         {
//           total,
//         },
//         { new: true }
//       );
//       return res.status(HTTP.CREATED).json({
//         message: "product updated",
//         data: updateProduct,
//       });
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `this is not a product `,
//       });
//     }
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `can't update product ${error}`,
//     });
//   }
// };
// export const updateProductAmount = async (req: Request, res: Response) => {
//   try {
//     const { productID } = req.params;
//     const { amount } = req.body;
//     const product = await productModel.findById(productID);
//     if (product) {
//       const updateProduct = await productModel.findByIdAndUpdate(
//         productID,
//         {
//           amount,
//         },
//         { new: true }
//       );
//       return res.status(HTTP.CREATED).json({
//         message: "product updated",
//         data: updateProduct,
//       });
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `this is not a product `,
//       });
//     }
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `can't update product ${error}`,
//     });
//   }
// };
// export const updateProductQuantity = async (req: Request, res: Response) => {
//   try {
//     const { productID } = req.params;
//     const { QTYinStock } = req.body;
//     const product = await productModel.findById(productID);
//     if (product) {
//       const updateProduct = await productModel.findByIdAndUpdate(
//         productID,
//         {
//           QTYinStock,
//         },
//         { new: true }
//       );
//       return res.status(HTTP.CREATED).json({
//         message: "product updated",
//         data: updateProduct,
//       });
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `this is not a product `,
//       });
//     }
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `can't update product ${error}`,
//     });
//   }
// };
// export const updateProductImg = async (req: Request, res: Response) => {
//   try {
//     const { productID } = req.params;
//     const { img } = req.body;
//     const { secure_url }: any = await streamUpload(req);
//     const product = await productModel.findById(productID);
//     if (product) {
//       const updateProduct = await productModel.findByIdAndUpdate(
//         productID,
//         {
//           img: secure_url,
//         },
//         { new: true }
//       );
//       return res.status(HTTP.CREATED).json({
//         message: "product updated",
//         data: updateProduct,
//       });
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `this is not a product `,
//       });
//     }
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `can't update product ${error}`,
//     });
//   }
// };
// export const deleteProduct = async (req: Request, res: Response) => {
//   try {
//     const { userID, storeID, productID } = req.params;
//     const user = await userModel.findById(userID);
//     if (user) {
//       const store = await storeModel.findById(storeID);
//       if (store) {
//         const product = await productModel.findById(productID);
//         if (product) {
//           const deleteProduct = await productModel.findByIdAndDelete(productID);
//           // store?.products?.pull(product?._id)
//           // store?.save();
//           // store?.products?.pull(product._id);
//           // store.save();
//           return res.status(HTTP.OK).json({
//             message: "product deleted",
//             data: deleteProduct,
//           });
//         } else {
//           return res.status(HTTP.BAD_REQUEST).json({
//             message: `this product does not belong to you `,
//           });
//         }
//       } else {
//         return res.status(HTTP.BAD_REQUEST).json({
//           message: `you don't have access to this store `,
//         });
//       }
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `you are not a user `,
//       });
//     }
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error deleting product ${error}`,
//     });
//   }
// };
// export const searchProductName = async (req: Request, res: Response) => {
//   try {
//     const { name } = req.params;
//     const product = await productModel.find({ name });
//     return res.status(HTTP.OK).json({
//       message: `product name found`,
//       data: product,
//     });
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error searching one product name ${error} `,
//     });
//   }
// };
// export const adminDeleteProduct = async (req: Request, res: Response) => {
//   try {
//     const { adminID, productID } = req.params;
//     const admin = await userModel.findById(adminID);
//     if (admin) {
//       const product = await productModel.findByIdAndDelete(productID);
//       return res.status(HTTP.OK).json({
//         message: `${admin?.name} admin got ${product?.title} deleted`,
//         data: product,
//       });
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `you are not an admin`,
//       });
//     }
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error deleting store ${error}`,
//     });
//   }
// };
// export const updateProductStock = async (req: any, res: Response) => {
//   try {
//     const { productID } = req.params;
//     const { QTYPurchased } = req.body;
//     const product = await productModel.findById(productID);
//     if (product) {
//       let viewProduct = await productModel.findByIdAndUpdate(
//         productID,
//         { QTYinStock: product.QTYinStock - QTYPurchased },
//         { new: true }
//       );
//       return res.status(HTTP.OK).json({
//         message: "update one product",
//         data: viewProduct,
//       });
//     }
//   } catch (error: any) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: "Error",
//       data: error.message,
//     });
//   }
// };
// export const ProductPayment = async (req: Request, res: Response) => {
//   try {
//     const { amount } = req.body;
//     const params = JSON.stringify({
//       email: "buyer@email.com",
//       amount: amount * 100,
//     });
//     const options = {
//       hostname: "api.paystack.co",
//       port: 443,
//       path: "/transaction/initialize",
//       method: "POST",
//       headers: {
//         Authorization:
//           "Bearer sk_test_ec1b0ccabcb547fe0efbd991f3b64b485903c88e",
//         "Content-Type": "application/json",
//       },
//     };
//     const ask = https
//       .request(options, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           console.log(JSON.parse(data));
//           res.status(HTTP.CREATED).json({
//             message: "Payment successful",
//             data: JSON.parse(data),
//           });
//         });
//       })
//       .on("error", (error) => {
//         console.error(error);
//       });
//     ask.write(params);
//     ask.end();
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: "Error making Payment",
//     });
//   }
// };
// export const updateProductToggle = async (req: any, res: Response) => {
//   try {
//     const { productID } = req.params;
//     const { toggle } = req.body;
//     const product = await productModel.findById(productID);
//     if (product) {
//       let toggledView = await productModel.findByIdAndUpdate(
//         productID,
//         { toggle },
//         { new: true }
//       );
//       return res.status(HTTP.OK).json({
//         message: "update toggle product",
//         data: toggledView,
//       });
//     }
//   } catch (error: any) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: "Error",
//       data: error.message,
//     });
//   }
// };
// class OrderController {
//   async getMonthlyOrders() {
//     const monthlyOrders = await orderModel.aggregate([
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
//           totalOrders: { $sum: 1 },
//         },
//       },
//       {
//         $sort: { _id: 1 },
//       },
//     ]);
//     return monthlyOrders;
//   }
// }
// export default OrderController;
class OrderController {
    getMonthlyOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const monthlyOrders = yield orderModel_1.default.aggregate([
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                            totalOrders: { $sum: 1 },
                        },
                    },
                    {
                        $sort: { _id: 1 },
                    },
                ]);
                return monthlyOrders;
            }
            catch (error) {
                console.error("Error fetching monthly orders:", error);
                throw error;
            }
        });
    }
}
exports.default = OrderController;

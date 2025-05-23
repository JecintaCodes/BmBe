import { Request, Response } from "express";
import userModel from "../model/userMode";
import productModel from "../model/productModel";
import { streamUpload } from "../utils/stream";
import { HTTP } from "../error/mainError";
import { Types } from "mongoose";
import orderModel from "../model/orderModel";
import listModel from "../model/listModel";
import mongoose from "mongoose";
import categoryModel from "../model/categoryModel";

// export const createProduct = async (req: Request, res: Response) => {
//   try {
//     const { userID } = req.params;
//     const { title, description, QTYinStock, amount, categoryName } = req.body;
//     const { secure_url }: any = await streamUpload(req);

//     const user: any = await userModel.findById(userID);

//     if (user && user.role === "USER") {
//       const category = await categoryModel.findOne({ categoryName });
//       if (!category) {
//         console.log("invalid category");
//       }
//       const product: any = await productModel.create({
//         userID: user?._id,
//         postBy: user?.name,
//         title,
//         img: secure_url,
//         QTYinStock,
//         amount,
//         description,
//         category: category?.CategoryName,
//       });
//       if (category?.CategoryName === product?.category) {
//         category?.products?.push(new Types.ObjectId(product?._id));
//         category?.save();
//         product.categorys.push(new Types.ObjectId(product?._id));
//         product?.save();
//         if (user && user.myStore) {
//           user.myStore.push(new Types.ObjectId(product?._id));
//           user.save();
//         }

//         if (product && product.category) {
//           product.categorys.push(new Types.ObjectId(product?._id));
//           product.save();
//         }

//         return res.status(HTTP.CREATED).json({
//           message: `has succesfully created ${product.title} `,
//           data: product,
//         });
//       } else {
//         return res.status(HTTP.BAD_REQUEST).json({
//           message: `wrong category`,
//         });
//       }
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `you are not a user`,
//       });
//     }
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `Cannot create store: ${error}`,
//     });
//   }
// };
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { title, description, QTYinStock, amount, categoryName } = req.body;
    const { secure_url }: any = await streamUpload(req);
    // console.log(secure_url);
    // Find the user creating the product
    const user: any = await userModel.findById(userID);

    if (!user || user.role !== "USER") {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "You are not authorized to create a product.",
      });
    }

    // Find the category by name
    const category = await categoryModel.findOne({
      categoryName: categoryName,
    });
    console.log(categoryName);
    // const category = await categoryModel.findOne({
    //   categoryName: { $regex: `^${categoryName}$`, $options: "i" },
    // });
    if (!category) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Invalid category. Please choose a valid category.",
      });
    }

    // Create the product with the correct category
    const product: any = await productModel.create({
      userID: user._id,
      postBy: user.name,
      title,
      img: secure_url,
      QTYinStock,
      amount,
      description,
      category: category.categoryName,
    });
    console.log("object");
    console.log("");
    console.log("Category Name from Request:", category?.categoryName);
    // console.log(secure_url);

    // Add the product to the category's product list
    // category.products.push(new Types.ObjectId(product._id));
    // await category.save();

    // Optional: Add the product to the user's store (if applicable)
    // if (user.myStore) {
    //   user.myStore.push(new Types.ObjectId(product._id));
    //   await user.save();
    // }
    // product?.categorys?.push(new Types.ObjectId(category?._id));
    // product?.users?.push(new Types.ObjectId(product?._id));
    // await product?.save();
    // user?.products?.push(new Types.ObjectId(user?._id));
    // user?.save();
    await userModel.findByIdAndUpdate(user._id, {
      $addToSet: { products: user._id, myStore: product?._id },
    });

    await productModel.findByIdAndUpdate(product._id, {
      $addToSet: {
        users: product?._id,
        categorys: product?._id,
      },
    });
    await categoryModel.findByIdAndUpdate(category?._id, {
      $addToSet: {
        products: product?._id,
      },
    });
    // Return the created product details
    return res.status(HTTP.CREATED).json({
      message: `Successfully created ${product.title}.`,
      data: product,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Cannot create product: ${error.message}`,
    });
  }
};

export const readProduct = async (req: Request, res: Response) => {
  try {
    const product = await productModel.find({}, null, {
      sort: { createdAt: "descending" },
    });
    return res.status(HTTP.OK).json({
      message: "reading all the products",
      data: product,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `can't read data ${error} `,
    });
  }
};
export const readOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderModel.find({}, null, {
      sort: { createdAt: "descending" },
    });
    return res.status(HTTP.OK).json({
      message: "reading all the orders",
      data: orders,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `can't read data ${error} `,
    });
  }
};
export const readOneUserOrders = async (req: Request, res: Response) => {
  try {
    const { orderID } = req.params;
    const orders = await orderModel.findById(orderID).populate({
      path: "users",
      options: {
        sort: { createdAt: "descending" },
      },
    });
    // {}, null, {
    // sort: { createdAt: "descending" },
    // }
    return res.status(HTTP.OK).json({
      message: "reading one user orders",
      data: orders,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `can't read data ${error} `,
    });
  }
};

export const readOneProduct = async (req: Request, res: Response) => {
  try {
    const { productID } = req.params;

    const product = await productModel.findById(productID);

    return res.status(HTTP.OK).json({
      message: "gotten one product",
      data: product,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `cannot read one product ${error}`,
    });
  }
};

export const updateUserProduct = async (req: Request, res: Response) => {
  try {
    const { amount, QTYinStock } = req.body;
    const { productID } = req.params;

    const product = await productModel.findById(productID);
    if (product) {
      const updateProduct = await productModel.findByIdAndUpdate(
        productID,
        {
          amount,
          QTYinStock,
        },
        { new: true }
      );
      return res.status(HTTP.CREATED).json({
        message: "user Product Updated",
        data: updateProduct,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).json({
        message: `no such product available`,
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error updating user product ${error}`,
    });
  }
};

// export const updateProducts = async (req: Request, res: Response) => {
//   try {
//     const { productID } = req.params;
//     const { title, description, QTYpurchased, amount } = req.body;
//     const { secure_url }: any = await streamUpload(req);

//     const product = await productModel.findById(productID);

//     if (product) {
//       let viewProduct = await productModel.findByIdAndUpdate(
//         productID,
//         {
//           QTYinStock: product.QTYinStock - QTYpurchased,
//           title,
//           amount,
//           img: secure_url,
//           description,
//         },
//         { new: true }
//       );
//       return res.status(HTTP.CREATED).json({
//         message: "One product gotten",
//         data: viewProduct,
//       });
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `error getting One product`,
//       });
//     }
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error getting One product ${error}`,
//     });
//   }
// };
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productID } = req.params;
    const { title, description, QTYinStock, amount } = req.body;
    const { secure_url }: any = await streamUpload(req);

    const product = await productModel.findById(productID);

    if (product) {
      let updatedProduct = await productModel.findByIdAndUpdate(
        productID,
        {
          title,
          amount,
          img: secure_url,
          description,
          QTYinStock,
        },
        { new: true }
      );
      return res.status(HTTP.OK).json({
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).json({
        message: `Product not found`,
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error updating product: ${error}`,
    });
  }
};

export const purchaseProduct = async (req: Request, res: Response) => {
  try {
    const { productID, userID } = req.params;
    const { QTYOrder } = req.body;

    const product = await productModel.findById(productID);

    if (product) {
      if (product?.QTYinStock > QTYOrder) {
        // purchase product
        const productOwner = await userModel.findById(product?.userID);
        const productBuyer = await userModel.findById(userID);

        // update store's quantity
        let viewProduct = await productModel.findByIdAndUpdate(
          productID,
          { QTYinStock: product.QTYinStock - QTYOrder },
          { new: true }
        );

        const order: any = await orderModel.create({
          QTYOrder,
          title: product.title,
          productOwner: product.userID,
          img: product.img,
          description: product.description,
          amountPaid: QTYOrder * product.amount,
          address: productBuyer?.address,
        });

        // update entries

        productOwner?.order.push(new Types.ObjectId(order?._id));
        productOwner?.save();

        productBuyer?.order.push(new Types.ObjectId(order?._id));
        productBuyer?.save();

        return res.status(HTTP.CREATED).json({
          message: "One product gotten",
          data: viewProduct,
        });
      } else {
        return res.status(HTTP.BAD_REQUEST).json({
          message: `Purchase volume has to be lesser than or equal to what is left in our store`,
        });
      }
    } else {
      return res.status(HTTP.BAD_REQUEST).json({
        message: `error getting One product`,
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error getting One product ${error}`,
    });
  }
};

export const viewUserProduct = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Invalid userID",
      });
    }
    // }
    const user = await userModel.findById(userID).populate({
      path: "myStore",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    if (user) {
      return res.status(HTTP.CREATED).json({
        message: "product updated",
        data: user,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).json({
        message: `this is not a product `,
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `can't update product ${error}`,
    });
  }
};
export const viewProductUser = async (req: Request, res: Response) => {
  try {
    const { productID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Invalid productID",
      });
    }

    const user = await userModel.findById(productID);

    if (user) {
      return res.status(HTTP.OK).json({
        message: "product fetched",
        data: user,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).json({
        message: `product not found`,
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `server error: ${error}`,
    });
  }
};
// export const viewOrders = async (req: Request, res: Response) => {
//   try {
//     const { userID } = req.params;

//     const orders = await userModel.findById(userID).populate({
//       path: "orders",
//       options: {
//         sort: {
//           createdAt: "descending",
//         },
//       },
//     });

//     if (orders) {
//       return res.status(HTTP.OK).json({
//         message: "Orders retrieved",
//         data: orders,
//       });
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `User not found or no orders`,
//       });
//     }
//   } catch (error) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `Error retrieving orders: ${error}`,
//     });
//   }
// };
export const viewOrders = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    // Find user and populate their orders
    const userWithOrders = await userModel.findById(userID).populate({
      path: "order",
      options: {
        sort: { createdAt: -1 }, // Sort orders by creation date in descending order
      },
    });

    // Check if the user exists
    if (!userWithOrders) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "User not found",
      });
    }

    // Check if the user has any orders
    if (userWithOrders.order.length > 0) {
      return res.status(HTTP.OK).json({
        message: "Orders retrieved",
        data: userWithOrders, // Return the orders
      });
    } else {
      return res.status(HTTP.OK).json({
        // Changed to OK status
        message: "User has no orders",
      });
    }
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error retrieving orders: ${error.message || error}`,
    });
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userID, categoryID, productID } = req.params;

    const user: any = await userModel.findById(userID);

    if (user) {
      const product = await productModel.findById(productID);

      if (product) {
        console.log(user?._id);
        console.log(product?.userID);

        if (product?.userID === user?._id.toString()) {
          // Remove product ID from user's products and myStore arrays
          await userModel.updateMany(
            { products: product?._id },
            {
              $pull: {
                products: user?._id,
                myStore: product?._id,
              },
            }
          );

          // Remove product ID from category's products array
          await categoryModel.updateMany(
            { _id: categoryID, products: product?._id },
            {
              $pull: {
                products: product?._id,
              },
            }
          );

          // Remove product document
          const deletedProduct = await productModel.findByIdAndDelete(
            productID
          );

          return res.status(HTTP.OK).json({
            message: "Product Deleted",
            data: deletedProduct,
          });
        } else {
          return res.status(HTTP.BAD_REQUEST).json({
            message: `This product does not belong to you.`,
          });
        }
      } else {
        return res.status(HTTP.BAD_REQUEST).json({
          message: "Invalid product.",
        });
      }
    } else {
      return res.status(HTTP.BAD_REQUEST).json({
        message: `You are not a user.`,
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error deleting product: ${error}`,
    });
  }
};

// export const deleteProduct = async (req: Request, res: Response) => {
//   try {
//     const { userID, categoryID, productID } = req.params;

//     const user: any = await userModel.findById(userID);

//     if (user) {
//       const category = await categoryModel.findById(categoryID);
//       if (category) {
//         const product = await productModel.findById(productID);

//         console.log(user?._id);
//         console.log(product?.userID);

//         if (product?.userID === user?._id.toString()) {
//           const deleteProduct = await productModel.findByIdAndDelete(productID);

//           // Remove product ID from user's products and myStore arrays
//           await userModel.updateMany(
//             { products: product._id },
//             {
//               $pull: {
//                 products: product._id,
//                 myStore: product._id,
//               },
//             }
//           );
//           // Remove product ID from user's products and myStore arrays
//           // await userModel.updateMany(
//           //   { products: product._id },
//           //   {
//           //     $pull: {
//           //       products: product._id,
//           //       myStore: product._id,
//           //     },
//           //   }
//           // );

//           // // Remove product ID from category's products array
//           // await categoryModel.updateMany(
//           //   { products: product._id },
//           //   {
//           //     $pull: {
//           //       products: product._id,
//           //     },
//           //   }
//           // );

//           // // Remove product document
//           // await productModel.deleteOne({ _id: product._id });

//           return res.status(HTTP.OK).json({
//             message: "Product Deleted",
//             data: deleteProduct,
//           });
//         } else {
//           return res.status(HTTP.BAD_REQUEST).json({
//             message: `this product does not belong to you `,
//           });
//         }
//       } else {
//         return res.status(HTTP.BAD_REQUEST).json({
//           message: "invalid Category",
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
export const viewLists = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const list = await listModel.find({ title });

    return res.status(HTTP.OK).json({
      message: "all user gotten list",
      data: list,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error creating product ${error}`,
    });
  }
};
export const viewAllLists = async (req: Request, res: Response) => {
  try {
    const list = await listModel.find({}, null, {
      sort: { createdAt: "descending" },
    });

    return res.status(HTTP.OK).json({
      message: "all user gotten list",
      data: list,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error creating product ${error}`,
    });
  }
};
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
export const deleteProductList = async (req: Request, res: Response) => {
  try {
    const { listID } = req.params;

    const list = await listModel.findByIdAndDelete(listID);

    return res.status(HTTP.OK).json({
      message: "deleted list",
      data: list,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error creating product ${error}`,
    });
  }
};
// export const createProductList = async (req: Request, res: Response) => {
//   try {
//     const { userID } = req.params;
//     const { lists }: { lists: any[] } = req.body;

//     console.log("Request body:", req.body);
//     console.log("User ID:", userID);

//     if (!lists || !Array.isArray(lists)) {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: "Invalid request: lists array required",
//       });
//     }

//     const user = await userModel.findById(userID);
//     if (user) {
//       const createdLists = await Promise.all(
//         lists.map(async (list) => {
//           const newList = await listModel.create({
//             title: list.title,
//             amount: list.amount,
//             userID: user._id,
//           });
//           return newList;
//         })
//       );

//       // console.log("Created lists:", createdLists);

//       // await user.updateOne({
//       //   $push: { lists: { $each: createdLists.map((list) => list._id) } },
//       // });

//       return res.status(HTTP.CREATED).json(createdLists);
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `you are not a user`,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: "Internal Server Error",
//     });
//   }
// };

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
// listController.ts

export const createProductList = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { lists }: { lists: any[] } = req.body;

    console.log("Request body:", req.body);
    console.log("User ID:", userID);

    if (!lists || !Array.isArray(lists)) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Invalid request: lists array required",
      });
    }

    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: `User not found`,
      });
    }

    const createdLists = await Promise.all(
      lists.map(async (list) => {
        const newList = await listModel.create({
          title: list.title,
          amount: list.amount,
          userID: user._id,
          refNumb: Math.floor(100000 + Math.random() * 900000).toString(), // Generate unique refNumb
        });
        return newList;
      })
    );

    // Add created lists to user document
    await user.updateOne({
      $push: { lists: { $each: createdLists.map((list) => list._id) } },
    });

    return res.status(HTTP.CREATED).json(createdLists);
  } catch (error) {
    console.error(error);
    return res.status(HTTP.BAD_REQUEST).json({
      message: "Server error",
    });
  }
};
class OrderController {
  async getMonthlyOrders() {
    try {
      const monthlyOrders = await orderModel.aggregate([
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
    } catch (error) {
      console.error("Error fetching monthly orders:", error);
      throw error;
    }
  }
}

export default OrderController;

// export const searchProducts = async (req: Request, res: Response) => {
//   try {
//     const { title } = req.body;
//     const product = await productModel.find({ title });
//     return res.status(HTTP.OK).json({
//       message: `gotten product`,
//       data: product,
//     });
//   } catch (error: any) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error seaching message ${error?.message}`,
//     });
//   }
// };

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { title } = req.query;
    const product = await productModel.find({
      title: { $regex: `^${title}`, $options: "i" }, // Partial matching from start
    });
    if (!product.length) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: `No products found with title ${title}`,
      });
    }
    return res.status(HTTP.OK).json({
      message: `Products found`,
      data: product,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error searching products: ${error?.message}`,
    });
  }
};

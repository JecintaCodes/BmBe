import { Request, Response } from "express";
import { HTTP } from "../error/mainError";
import categoryModel from "../model/categoryModel";
import productModel from "../model/productModel";
import { streamUpload } from "../utils/stream";

export const crateCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.body;
     const { secure_url,public_id }: any = await streamUpload(req);
    const category = await categoryModel.create({
      categoryName,
      img:secure_url,
      imgID:public_id,
    });
    return res.status(HTTP.CREATED).json({
      message: `category created`,
      data: category,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error creating category :${error?.message}`,
    });
  }
};
export const findOneProductsCategory = async (req: Request, res: Response) => {
  try {
    // Assuming you pass a category ID in the URL (e.g., /categories/:id)
    const { categoryID } = req.params;

    // Find category by ID and populate its services
    const prodCategory = await categoryModel.findById(categoryID).populate({
      path: "products", // Make sure this matches the field name in category schema
      options: {
        sort: { createdAt: -1 }, // Sorting by creation date in descending order
      },
    });

    if (!prodCategory) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Category not found.",
      });
    }

    return res.status(HTTP.CREATED).json({
      message: "prods for category fetched successfully.",
      data: prodCategory,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error: ${error.message}`,
    });
  }
};
export const findOneCategoryProducts = async (req: Request, res: Response) => {
  try {
    // Assuming you pass a category ID in the URL (e.g., /categories/:id)
    const { productID } = req.params;

    // Find product by ID and populate its services
    const catProduct = await productModel.findById(productID).populate({
      path: "categorys", // Make sure this matches the field name in category schema
      options: {
        sort: { createdAt: -1 }, // Sorting by creation date in descending order
      },
    });

    if (!catProduct) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "product not found.",
      });
    }

    return res.status(HTTP.CREATED).json({
      message: "category for  prods fetched successfully.",
      data: catProduct,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error: ${error.message}`,
    });
  }
};
export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryModel.find();
    return res.status(HTTP.OK).json({
      message: "getton all categories",
      data: category,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error getting categories ${error}`,
    });
  }
};

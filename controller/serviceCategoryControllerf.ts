import { Request, Response } from "express";
import { HTTP } from "../error/mainError";
import serviceCategoryModel from "../model/serviceCategoryModel";

export const createServiceCategory = async (req: Request, res: Response) => {
  try {
    const { serviceCategoryName } = req.body;
    if (!serviceCategoryModel) {
      
    }
    const service = await serviceCategoryModel.create({
      serviceCategoryName,
    });
    return res.status(HTTP.CREATED).json({
      message: "service category is created",
      data: service,
    });
  } catch (error: any) {
    return res.status(HTTP?.BAD_REQUEST).json({
      message: `error creating service category${error?.message}`,
    });
  }
};
export const getAllServiceCategory = async (req: Request, res: Response) => {
  try {
    const category = await serviceCategoryModel.find();
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
export const findOneServiceCategory = async (req: Request, res: Response) => {
  try {
    // Assuming you pass a category ID in the URL (e.g., /categories/:id)
    const { categoryID } = req.params;

    // Find category by ID and populate its services
    const serviceCategory = await serviceCategoryModel
      .findById(categoryID)
      .populate({
        path: "services", // Make sure this matches the field name in category schema
        options: {
          sort: { createdAt: -1 }, // Sorting by creation date in descending order
        },
      });

    if (!serviceCategory) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Category not found.",
      });
    }

    return res.status(HTTP.CREATED).json({
      message: "Services for category fetched successfully.",
      data: serviceCategory,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error: ${error.message}`,
    });
  }
};

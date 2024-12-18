import { Request, Response } from "express";
import { HTTP } from "../error/mainError";
import serviceCategoryModel from "../model/serviceCategoryModel";

export const createServiceCategory = async (req: Request, res: Response) => {
  try {
    const { ServiceCategoryName } = req.body;
    const service = await serviceCategoryModel.create({
      ServiceCategoryName,
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

import { Request, Response } from "express";
import { HTTP } from "../error/mainError";
import categoryModel from "../model/categoryModel";

export const crateCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.body;
    const category = await categoryModel.create({
      categoryName,
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
export const findOneProductCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryModel.find().populate({
      path: "prods",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });
    return res.status(HTTP?.CREATED).json({
      message: "products category",
      data: category,
    });
  } catch (error: any) {
    return res.status(HTTP?.BAD_REQUEST).json({
      message: `error ${error?.message} `,
    });
  }
};
// export const findOneServiceCategory = async (req: Request, res: Response) => {
//   try {
//     const service = await categoryModel.find().populate({
//       path: "services",
//       options: {
//         sort: {
//           createdAt: -1,
//         },
//       },
//     });
//     return res.status(HTTP?.CREATED).json({
//       message: "services category",
//       data: service,
//     });
//   } catch (error: any) {
//     return res.status(HTTP?.BAD_REQUEST).json({
//       message: `error ${error?.message} `,
//     });
//   }
// };

export const findOneServiceCategory = async (req: Request, res: Response) => {
  try {
    // Assuming you pass a category ID in the URL (e.g., /categories/:id)
    const { categoryID } = req.params;

    // Find category by ID and populate its services
    const serviceCategory = await categoryModel.findById(categoryID).populate({
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

// export const findOneBookRideCategory = async (req: Request, res: Response) => {
//   try {
//     const bookRide = await categoryModel.find().populate({
//       path: "bookRides",
//       options: {
//         sort: {
//           createdAt: -1,
//         },
//       },
//     });
//     return res.status(HTTP?.CREATED).json({
//       message: "services category",
//       data: bookRide,
//     });
//   } catch (error: any) {
//     return res.status(HTTP?.BAD_REQUEST).json({
//       message: `error ${error?.message} `,
//     });
//   }
// };
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

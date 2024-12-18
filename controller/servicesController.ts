import { Request, Response } from "express";
import { HTTP } from "../error/mainError";
import userMode from "../model/userMode";
import servicesModel from "../model/servicesModel";
import { streamUpload } from "../utils/stream";
import categoryModel from "../model/categoryModel";
import { role } from "../utils/role";

// export const createServices = async (req: Request, res: Response) => {
//   try {
//     const { title, url, description, amount, userID, category, categoryName } =
//       req.body;
//     const { secure_url }: any = await streamUpload(req);
//     const user = await userMode.findById(userID);

//     if (user?.role === role?.user) {
//       const category = await categoryModel.findOne({
//         categoryName: categoryName,
//       });
//       if (!category) {
//         return res.status(HTTP?.BAD_REQUEST).json({
//           message: "invalid Category",
//         });
//       }
//       const services = await servicesModel.create({
//         title,
//         description,
//         url,
//         amount,
//         serviceOwnerName: user?.name,
//         images: secure_url,
//         userID: user?._id,
//         category: category?.categoryName,
//       });
//       // category?.services.push(new Types.ObjectId(services?._id));
//       category?.services.push(new Types.ObjectId(services._id));
//       category?.save();
//       user?.services.push(new Types.ObjectId(services._id));
//       user?.save();
//       services?.users?.push(new Types.ObjectId(user?._id));
//       services?.categorys?.push(new Types.ObjectId(category?._id));
//       services?.save();
//       //   services?.categorys?.push(new Types.ObjectId(services?._id!));

//       return res.status(HTTP.CREATED).json({
//         message: `services created: ${services.serviceOwnerName}`,
//       });
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: `you are not a valid user`,
//       });
//     }
//   } catch (error: any) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error creating services:${error?.message}`,
//     });
//   }
// };
export const createServices = async (req: Request, res: Response) => {
  try {
    const { title, url, description, amount, categoryName } = req.body;
    const { userID } = req.params;
    const { secure_url }: any = await streamUpload(req); // Upload image using your custom upload function

    // Find the user creating the service
    const user = await userMode.findById(userID);
    if (!user || user.role !== role?.user) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "You are not a valid user",
      });
    }

    // Find the category
    const category = await categoryModel.findOne({ categoryName });
    if (!category) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Invalid Category",
      });
    }

    // Create the service
    const services = await servicesModel.create({
      title,
      description,
      url,
      amount,
      serviceOwnerName: user.name,
      images: secure_url,
      userID: user._id,
      category: category.categoryName,
    });

    // Update category and user to reflect new service
    await categoryModel.updateOne(
      { _id: category._id },
      { $push: { services: services._id } } // Add the service ID to the category's services array
    );

    await userMode.updateOne(
      { _id: user._id },
      { $push: { services: services._id } } // Add the service ID to the user's services array
    );

    // Update the service to reflect the user and category references
    await servicesModel.updateOne(
      { _id: services._id },
      { $push: { users: user._id, categorys: category._id } } // Add user and category to the service's respective arrays
    );

    return res.status(HTTP.CREATED).json({
      message: `Service created by: ${services.serviceOwnerName}`,
      data: services,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `Error creating service: ${error.message}`,
    });
  }
};

export const allServiceCategory = async (req: Request, res: Response) => {
  try {
    const service = await servicesModel.find().populate({
      path: "categorys",
      options: {
        sort: { createdAt: -1 },
      },
    });
    return res.status(HTTP.OK).json({
      message: `gotten all services inside category`,
      data: service,
    });
  } catch (error: any) {
    res.status(HTTP.BAD_REQUEST).json({
      mesage: `error for finding all services category ${error} `,
    });
  }
};
export const allControllerServices = async (req: Request, res: Response) => {
  try {
    const services = await categoryModel.find().populate({
      path: "services",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });
    return res.status(HTTP.OK).json({
      message: "getting all categories from the services",
      data: services,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error getting all controller services ${error}`,
    });
  }
};

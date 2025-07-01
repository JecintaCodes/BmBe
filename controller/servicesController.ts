import { Request, Response } from "express";
import { HTTP } from "../error/mainError";
import userModel from "../model/userMode";
import servicesModel from "../model/servicesModel";
import { streamUpload } from "../utils/stream";
import { role } from "../utils/role";
import serviceCategoryModel from "../model/serviceCategoryModel";
import { Types } from "mongoose";

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
    const { title, url, description, serviceCategoryName } = req.body;
    const { userID } = req.params;
    const { secure_url }: any = await streamUpload(req); // Upload image using your custom upload function

    // Find the user creating the service
    const user = await userModel.findById(userID);
    if (!user || user.role !== role?.user) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "You are not a valid user",
      });
    }

    // Find the category
    const category = await serviceCategoryModel.findOne({
      serviceCategoryName: serviceCategoryName,
    });
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
      serviceOwnerName: user.name,
      img: secure_url,
      userID: user._id,
      category: category.serviceCategoryName,
    });

    // Update category and user to reflect new service
    await serviceCategoryModel.updateOne(
      { _id: category._id },
      { $push: { services: services._id } } // Add the service ID to the category's services array
    );

    await userModel.updateOne(
      { _id: user._id },
      { $push: { services: services._id, serviceCategory: services?._id } } // Add the service ID to the user's services array
    );

    // Update the service to reflect the user and category references
    await servicesModel.updateOne(
      { _id: services._id },
      { $push: { users: user._id, serviceCategory: category._id } } // Add user and category to the service's respective arrays
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
// export const allCategoryServices = async (req: Request, res: Response) => {
//   try {
//     const services = await serviceCategoryModel.find().populate({
//       path: "services",
//       options: {
//         sort: {
//           createdAt: -1,
//         },
//       },
//     });
//     return res.status(HTTP.OK).json({
//       message: "getting all categories from the services",
//       data: services,
//     });
//   } catch (error: any) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error getting all controller services ${error}`,
//     });
//   }
// };
export const getOneUserServices = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await userModel.findById(userID).populate({
      path: "services",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });
    return res.status(HTTP.CREATED).json({
      message: "one user services gotten",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error getting one user services ${error?.message}`,
    });
  }
};
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await servicesModel.find();

    return res.status(HTTP.OK).json({
      message: "gotten all services",
      data: services,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error getting all services ${error?.message} `,
    });
  }
};

export const getOneService = async (req: Request, res: Response) => {
  try {
    const { serviceID } = req.params;
    const service = await servicesModel.findById(serviceID);
    return res.status(HTTP.OK).json({
      message: `gotten on service`,
      data: service,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error getting one services ${error}`,
    });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { userID, serviceCategoryID, serviceID } = req.params;

    const user = await userModel.findById(userID);

    if (user) {
      const service = await servicesModel.findByIdAndDelete(serviceID);

      if (service) {
        await userModel.updateMany(
          {
            services: service?._id,
          },
          {
            $pull: {
              services: service._id,
              serviceCategory: serviceCategoryID,
            },
          }
        );
        await serviceCategoryModel.updateMany(
          {
            _id: serviceCategoryID,
            services: service?._id,
          },
          {
            $pull: {
              services: service?._id,
            },
          }
        );

        await servicesModel.updateMany(
          { _id: service?._id, users: user?._id },
          {
            $pull: {
              users: user?._id,
              serviceCategory: serviceCategoryID,
            },
          }
        );
        return res.status(HTTP.OK).json({
          message: "services deleted",
          data: service,
        });
      } else {
        return res.status(HTTP.BAD_REQUEST).json({
          message: `service not found`,
        });
      }
    } else {
      return res.status(HTTP.BAD_REQUEST).json({
        message: `user not found`,
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error deleting service ${error?.message}`,
    });
  }
};
export const TotalService = async (req: Request, res: Response) => {
  try {
    const total = await servicesModel.countDocuments();
    return res.status(HTTP.OK).json({
      message: `total services gotten from the database`,
      data: total,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error getting total services :${error} `,
    });
  }
};
export const userTotalServices = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    // const user = await userModel.findById(userID);
      // Validate userID
    if (!userID || Types.ObjectId.isValid(userID)) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Invalid userID",
      });
    }
    

       const user = await userModel.findById(userID);
    if (!user) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "User not found",
      });
    }

    const totalUser = await servicesModel.countDocuments({ userID });
    return res.status(HTTP.OK).json({
      message: "total user service gotten",
      data: totalUser,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `error getting total user Product`,
    });
  }
};

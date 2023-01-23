import Store from "../models/Store.model.js";
import Product from "../models/Product.model.js";
import ErrorHandler from "../helpers/errorHandler.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../helpers/cloudinary.js";

export const addStore = asyncHandler(async (req, res, next) => {
  try {
    const {
      title,
      description,
      address,
      city,
      zipCode,
      state,
      country,
      email,
      phone,
    } = req.body;

    const addedBy = req.userInfo.userId;
    const location = { address, city, zipCode, state, country };
    const data = { title, description, location, email, phone, addedBy };

    const file = req.files.logo;

    const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
      public_id: `${Date.now()}`,
      folder: "store",
    });

    const store = await Store.create({
      title,
      description,
      location,
      email,
      phone,
      addedBy,
      logo: { public_id: myCloud.public_id, url: myCloud.secure_url },
    });

    await store.save();
    res.status(201).json({
      success: true,
      store,
    });
  } catch (error) {
    console.log(error.message);
    return next(new ErrorHandler("Something went wrong", 500));
  }
});

export const getStores = asyncHandler(async (req, res, next) => {
  try {
    let stores = [];
    const { roles } = req.userInfo;
    if (roles === "seller" || roles.includes("seller")) {
      const storeId = req.userInfo.storeId;
      const store = await Store.findById(storeId);
      stores.push(store);
    } else {
      stores = await Store.find();
    }
    res.status(200).json({ success: true, stores });
  } catch (error) {
    return next(new ErrorHandler("Not Found", 404));
  }
});

export const getStoreDetails = asyncHandler(async (req, res, next) => {
  const { roles } = req.userInfo;
  let store;
  if (roles === "seller" || roles.includes("seller")) {
    const storeId = req.userInfo.storeId;
    if (req.params.id !== storeId)
      return next(new ErrorHandler("Store not found", 404));
    store = await Store.findById(storeId);
  } else {
    store = await Store.findById(req.params.id);
  }
  if (!store) return next(new ErrorHandler("Store not found", 404));

  res.status(200).json({ success: true, store });
});

export const updateStore = asyncHandler(async (req, res, next) => {
  try {
    const {
      title,
      description,
      address,
      city,
      zipCode,
      state,
      country,
      email,
      phone,
    } = req.body;

    const updatedBy = req.userInfo.userId;
    const location = { address, city, zipCode, state, country };
    const data = { title, description, location, email, phone, updatedBy };
    const { roles } = req.userInfo;
    let store;

    if (roles === "seller" || roles.includes("seller")) {
      const storeId = req.userInfo.storeId;
      if (req.params.id !== storeId)
        return next(new ErrorHandler("Store not found", 404));
      store = await Store.findOne({ _id: req.params.id, store: storeId });
    } else {
      store = await Store.findById(req.params.id);
    }
    if (!store) return next(new ErrorHandler("Store not found", 404));

    store = await Store.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (req.files) {
      const imageId = store.logo.public_id;

      const remove = await cloudinary.uploader.destroy(imageId);
      const file = req.files.logo;
      if (remove) {
        const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "store",
        });
        store.logo = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };

        await store.save();
      }
    }

    res.status(201).json({ success: true, store });
  } catch (error) {
    console.log(error.message);
    return next(new ErrorHandler("Not procceded.", 500));
  }
});

export const deleteStore = asyncHandler(async (req, res, next) => {
  try {
    let store = await Store.findById(req.params.id);
    if (!store) return next(new ErrorHandler("Store not found", 404));

    const active = await Product.findOne({ store: req.params.id });
    if (active)
      return next(
        new ErrorHandler(
          "This store is used in product. Could not deleted",
          404
        )
      );

    const imageId = store.logo.public_id;

    await cloudinary.uploader.destroy(imageId);

    await store.remove();
    res.status(200).json({ success: true, message: "Store deleted." });
  } catch (error) {
    console.log(error.message);
    return next(new ErrorHandler("Not procceded.", 500));
  }
});

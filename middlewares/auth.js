import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import ErrorHandler from "../helpers/errorHandler.js";

export const isAuthintacted = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return next(new ErrorHandler("Forbidden", 403));
    req.userInfo = decoded.UserInfo;
    next();
  });
});

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.userInfo?.roles)
      return next(new ErrorHandler("Unauthorized", 401));
    const rolesArray = [...allowedRoles];
    const result = req.userInfo.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return next(new ErrorHandler("Unauthorized", 401));
    next();
  };
};

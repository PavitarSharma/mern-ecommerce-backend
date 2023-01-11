import jwt from "jsonwebtoken";
import createError from "http-errors";

export const signAccessToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    };

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "20s",
      issuer: "www.e-shop.com",
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};

export const signRefreshToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    };

    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "30d",
      issuer: "www.e-shop.com",
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};

export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(createError.Unauthorized());
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return next(createError.Forbidden("Forbidden"));
    }
    req.payload = payload;
    next();
  });
};

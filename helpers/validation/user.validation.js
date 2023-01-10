import Joi from "@hapi/joi";

export const signUpSchema = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required().max(70),
    password: Joi.string().min(8).max(50).required(),
    roles: Joi.array().items(Joi.string()).required(),
    avatar: Joi.string(),
  });

  return schema.validate(data);
};

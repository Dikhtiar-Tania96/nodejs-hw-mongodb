import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});


//схема для валідації логіну
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

//6hw
// export const requestResetEmailSchema = Joi. object({
//   email: Joi.string().email().required(),
// });
//6hw
// export const resetPasswordSchema = Joi.object({
//   password: Joi.string().required(),
//   token: Joi.string().required(),
// });
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  MONGO_URI: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().required(), 

  JWT_SECRET: Joi.string().required(),
  JWT_SECRET2: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  JWT_ADMIN: Joi.string().required(),

  ACCESKEYID: Joi.string().required(),
  SECRETACCESSKEY: Joi.string().required(),

  REGION: Joi.string().required(),
  BUCKET: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.number().required(),
  REDIS_DB: Joi.number().required(),
  
  Google_Client_ID: Joi.string().required(),
  Google_Client_Secret: Joi.string().required(),
  Google_Redirect_Url: Joi.string().required(),

  SMTP_HOST:Joi.string().required(),
  SMTP_PORT:Joi.number().required(),
  SMTP_SECURE: Joi.boolean().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required()







});

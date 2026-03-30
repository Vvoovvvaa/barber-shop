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
  REDIS_DB: Joi.number().required()

});



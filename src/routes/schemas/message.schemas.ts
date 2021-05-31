import * as Joi from "@hapi/joi";

// ****
// Validation Joi

export const createPayload = Joi.object({
  message: Joi.string().required(),
  channelId: Joi.string().required(),
});

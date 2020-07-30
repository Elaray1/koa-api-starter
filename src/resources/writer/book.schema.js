const Joi = require('@hapi/joi');

const booksSchema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string().required(),
  genre: Joi.string().valid('novel', 'poem').required(),
});

module.exports = (obj) => booksSchema.validate(obj, { allowUnknown: false });

const Joi = require('@hapi/joi');
const booksSchema = require('./book.schema');

const schema = Joi.object({
  _id: Joi.string(),
  firstName: Joi.string()
    .required(),
  lastName: Joi.string()
    .required(),
  age: Joi.number()
    .required(),
  createdOn: Joi.date(),
  books: Joi.array().items(booksSchema),
});

module.exports = (obj) => schema.validate(obj, { allowUnknown: false });

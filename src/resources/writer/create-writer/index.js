const Joi = require('@hapi/joi');
const validate = require('middlewares/validate');
const writerService = require('resources/writer/writer.service');
const booksSchema = require('../book.schema');

const schema = Joi.object({
  firstName: Joi.string()
    .required(),
  lastName: Joi.string()
    .required(),
  age: Joi.number()
    .required(),
  books: Joi.array().items(booksSchema),
});

async function handler(ctx) {
  const {
    firstName, lastName, age, books,
  } = ctx.request.body;
  const data = await writerService.create({
    firstName,
    lastName,
    age,
    books,
  });
  ctx.body = data;
}

module.exports.register = (router) => {
  router.post('/create', validate(schema), handler);
};

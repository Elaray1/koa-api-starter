const Joi = require('@hapi/joi');
const writerService = require('resources/writer/writer.service');

const validate = require('middlewares/validate');

const booksSchema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string().required(),
  genre: Joi.string().valid('novel', 'poem').required(),
});

const schema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  age: Joi.number(),
  books: Joi.array().items(booksSchema),
});

async function handler(ctx) {
  const data = await writerService.update({ _id: ctx.params.id }, (doc) => ({
    ...doc,
    ...ctx.validatedData,
  }));
  ctx.body = data;
}

module.exports.register = (router) => {
  router.put('/update/:id', validate(schema), handler);
};

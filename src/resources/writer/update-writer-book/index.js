const Joi = require('@hapi/joi');
const writerService = require('resources/writer/writer.service');

const validate = require('middlewares/validate');
const booksSchema = require('../book.schema');

const schemaBooks = Joi.object({
  books: Joi.array().items(booksSchema),
});

const schemaDelete = Joi.object({
  bookId: Joi.string(),
});

async function handlerUpdate(ctx) {
  const data = await writerService.update(
    { _id: ctx.params.id },
    { $push: { books: ctx.validatedData } },
  );
  ctx.body = data;
}

async function handlerDelete(ctx) {
  ctx.body = await writerService.update(
    { _id: ctx.params.id },
    { $pull: { books: { $in: [ctx.request.body.bookId] } } },
  );
}

async function handlerPost(ctx) {
  const data = await writerService.update({ _id: ctx.params.id }, (doc) => ({
    ...doc,
    ...ctx.validatedData,
  }));
  ctx.body = data;
}

module.exports.register = (router) => {
  router.put('/book/:id', validate(schemaBooks), handlerUpdate);
  router.delete('/book/:id', validate(schemaDelete), handlerDelete);
  router.post('/book/:id', validate(schemaBooks), handlerPost);
};

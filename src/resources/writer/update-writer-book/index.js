const Joi = require('@hapi/joi');
const writerService = require('resources/writer/writer.service');

const validate = require('middlewares/validate');

const booksSchema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string().required(),
  genre: Joi.string().valid('novel', 'poem').required(),
});

const schemaBooks = Joi.object({
  books: Joi.array().items(booksSchema),
});

const schemaDelete = Joi.object({
  bookId: Joi.string(),
});

async function handlerUpdate(ctx) {
  const data = await writerService.update({ _id: ctx.params.id }, (doc) => ({
    ...doc,
    ...ctx.validatedData.concat(doc.books),
  }));
  ctx.body = data;
}

async function handlerDelete(ctx) {
  const writer = await writerService.findOne({ _id: ctx.params.id });
  const bookIndex = writer.books.findIndex((el) => el._id === ctx.request.body.bookId);
  writer.books.splice(bookIndex, 1);
  ctx.body = await writerService.update({ _id: ctx.params.id }, () => ({
    ...writer,
  }));
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

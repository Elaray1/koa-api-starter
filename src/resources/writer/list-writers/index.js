const writerService = require('resources/writer/writer.service');
const Joi = require('@hapi/joi');

const validate = require('middlewares/validate');

const schema = Joi.object({
  pageNumber: Joi.number().required(),
  documentsInPage: Joi.number().required(),
  sortBy: Joi.string().valid('createdOn', 'firstName', 'lastName', 'id').default('firstName'),
  sortOrder: Joi.string().valid('desc', 'asc'),
});

async function handler(ctx) {
  const {
    pageNumber,
    documentsInPage,
    sortBy,
    sortOrder,
  } = ctx.request.body;
  const data = await writerService.find();
  const dataArr = data.results;
  const writers = dataArr.splice(pageNumber * documentsInPage, documentsInPage);
  const sortWriters = writers.sort((a, b) => {
    if (ctx.request.body[sortOrder] === 'desc') {
      return a[sortBy] >= b[sortBy];
    }
    return a[sortBy] < b[sortBy];
  });
  ctx.body = {
    data: sortWriters,
    meta: {
      numberOfAllDocuments: sortWriters.length,
    },
  };
}

module.exports.register = (router) => {
  router.get('/', validate(schema), handler);
};

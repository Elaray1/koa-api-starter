const writerService = require('resources/writer/writer.service');
const Joi = require('@hapi/joi');

const validate = require('middlewares/validate');

const schema = Joi.object({
  pageNumber: Joi.number().required(),
  documentsInPage: Joi.number().required(),
  sortBy: Joi.string().valid('createdOn', 'firstName', 'lastName', '_id').default('_id'),
  sortOrder: Joi.string().valid('desc', 'asc'),
});

async function handler(ctx) {
  const {
    pageNumber,
    documentsInPage,
    sortBy,
    sortOrder,
  } = ctx.request.body;
  const sortOrderNumber = sortOrder === 'asc' ? 1 : -1;
  const sortedWritersObj = (
    await writerService.find({}, {
      page: pageNumber,
      perPage: documentsInPage,
      sort: { [sortBy]: sortOrderNumber },
    })
  );
  ctx.body = {
    data: sortedWritersObj.results,
    meta: {
      numberOfAllDocuments: sortedWritersObj.count,
      totalPages: sortedWritersObj.pagesCount,
    },
  };
}

module.exports.register = (router) => {
  router.get('/', validate(schema), handler);
};

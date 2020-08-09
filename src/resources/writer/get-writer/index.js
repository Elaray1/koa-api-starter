const writerService = require('resources/writer/writer.service');

async function handler(ctx) {
  const data = await writerService.findOne({ _id: ctx.params.id });
  if (!data) {
    ctx.body = 'Writer is not found';
  } else {
    ctx.body = data;
  }
}

module.exports.register = (router) => {
  router.get('/:id', handler);
};

const writerService = require('resources/writer/writer.service');

async function handler(ctx) {
  const a = await writerService.find();
  ctx.body = a;
}

module.exports.register = (router) => {
  router.delete('/:id', handler);
};

const userService = require('resources/writer/writer.service');
const ioEmitter = require('ioEmitter');


userService.on('updated', ({ doc }) => {
  const roomId = `writer-${doc._id}`;
  ioEmitter.to(roomId).emit('writer:updated', doc);
});

const Router = require('@koa/router');


const router = new Router();

require('./create-writer').register(router);
require('./update-writer').register(router);
require('./remove-writer').register(router);
require('./update-writer-book').register(router);
require('./list-writers').register(router);
require('./get-writer').register(router);

module.exports = router.routes();

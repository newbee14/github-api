const fastify = require('fastify')({ logger: true })

fastify.register(require('fastify-cors'), { origin: '*' });

fastify.register(require('./api/github'))
// Run the server!
const start = async () => {
    try {
      await fastify.listen(8000);
      fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
      fastify.log.error(err);
      process.exit(1)
    }
  }
  start()
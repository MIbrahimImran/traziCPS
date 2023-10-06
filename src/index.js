import fastifyModule from 'fastify';
import populationRoutes from './routes/populationRoutes.js';
import { convertCSVtoJSON } from './utilites/csvParserUtil.js';

const fastifyInstance = fastifyModule({ logger: false });

async function setupServer() {
  await convertCSVtoJSON();
  fastifyInstance.register(populationRoutes);

  try {
    await fastifyInstance.listen({port: 5555});
    console.log(`Server is running at ${fastifyInstance.server.address().port}`);
  } catch (err) {
    fastifyInstance.log.error(err);
    process.exit(1);
  }
}

setupServer();

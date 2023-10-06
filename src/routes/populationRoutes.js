import { getPopulation, setPopulation } from '../services/populationService.js';

async function populationRoutes(fastify, options) {
    
  fastify.get('/api/population/state/:state/city/:city', async (request, reply) => {
    try {
      const state = request.params.state.toLowerCase();
      const city = request.params.city.toLowerCase();
      const population = await getPopulation(state, city);
      reply.send({ population });
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  });
  
  fastify.put('/api/population/state/:state/city/:city', async (request, reply) => {
    try {
      const state = request.params.state.toLowerCase();
      const city = request.params.city.toLowerCase();
      const population = parseInt(request.body);
      
      if (isNaN(population) || population <= 0) {
        throw new Error('Invalid population provided');
      }
      
      const isNew = await setPopulation(state, city, population);
      reply.status(isNew ? 201 : 200).send({ status: 'success' });
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  });
}

export default populationRoutes;

import fs from 'fs/promises';

let cacheData = {};

// Shouldnt technically be in this file, but since we are using a JSON file as our database,
// we need to load it into memory. Eveything below this layer should be using a DBMS.
async function getData(state) {
  if (!cacheData[state]) {
    try {
      const rawData = await fs.readFile(`./db/states/${state}.json`, 'utf8');
      cacheData[state] = JSON.parse(rawData);
    } catch (error) {
      console.error(`Error loading data for state ${state}:`, error);
      throw new Error('Invalid state provided');
    }
  }
  return cacheData[state];
}


const getPopulation = async (state, city) => {
  const loadedData = await getData(state);
  const cityPopulation = loadedData[city];
  
  if (cityPopulation === undefined) {
    throw new Error('Invalid city provided for the given state');
  }
  
  return cityPopulation;
};

  
const setPopulation = async (state, city, population) => {
  const loadedData = await getData(state);
  
  const isNew = loadedData[city] === undefined;
  loadedData[city] = population;
  
  await fs.writeFile(`./db/states/${state}.json`, JSON.stringify(loadedData, null, 2))
    .catch(error => {
      console.error(`Error writing data for state ${state}:`, error);
      throw error;
    });

  cacheData[state] = loadedData;
  return isNew;
};

  export { getPopulation, setPopulation };

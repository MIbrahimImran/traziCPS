import fs from 'fs/promises';

let cacheData = {};

// Shouldnt technically be in this file, but since we are using a JSON file as our database,
// we need to load it into memory. Eveything below this layer should be using a DBMS.
async function getData(state, initialChar) {
  const shardKey = `${state}-${initialChar}`;
  if (!cacheData[shardKey]) {
    try {
      const rawData = await fs.readFile(`./db/states/${state}/${initialChar}.json`, 'utf8');
      cacheData[shardKey] = JSON.parse(rawData);
    } catch (error) {
      console.error(`Error loading data for state ${state} and initial character ${initialChar}:`, error);
      throw new Error('Invalid state or city initial character provided');
    }
  }
  return cacheData[shardKey];
}

const getPopulation = async (state, city) => {
  const initialChar = city.charAt(0).toLowerCase();
  const loadedData = await getData(state, initialChar);
  const cityPopulation = loadedData[city];
  
  if (cityPopulation === undefined) {
    throw new Error('Invalid city provided for the given state');
  }
  
  return cityPopulation;
};

const setPopulation = async (state, city, population) => {
  const initialChar = city.charAt(0).toLowerCase();
  const loadedData = await getData(state, initialChar);
  
  const isNew = loadedData[city] === undefined;
  loadedData[city] = population;
  
  await fs.writeFile(`./db/states/${state}/${initialChar}.json`, JSON.stringify(loadedData, null, 2))
    .catch(error => {
      console.error(`Error writing data for state ${state} and initial character ${initialChar}:`, error);
      throw error;
    });

  cacheData[`${state}-${initialChar}`] = loadedData;
  return isNew;
};

export { getPopulation, setPopulation };
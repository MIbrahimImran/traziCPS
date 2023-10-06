import fs from 'fs/promises';

// Shouldnt technically be in this file, but since we are using a JSON file as our database,
// we need to load it into memory. Eveything below this layer should be using a DBMS.
async function getData() {
    try {
      const rawData = await fs.readFile('./db/data.json', 'utf8');
      data = JSON.parse(rawData);
    } catch (error) {
      console.error('Error loading data:', error);
      process.exit(1);
    }
  }


const getPopulation = async (state, city) => {
    const loadedData = await getData();
    const stateData = loadedData[state];
   
    if (!stateData) {
      throw new Error('Invalid state provided');
    }
  
    const population = stateData[city];
    if (population === undefined) {
      throw new Error('Invalid city provided for the given state');
    }
  
    return population;
  };
  
  const setPopulation = async (state, city, population) => {
    const loadedData = await loadedData();
    if (!loadedData[state]) {
      loadedData[state] = {};
    }
  
    const isNew = loadedData[state][city] === undefined;
    loadedData[state][city] = population;
  
    await fs.writeFile('./db/data.json', JSON.stringify(loadedData, null, 2));
  
    return isNew;
  };

  export { getPopulation, setPopulation };

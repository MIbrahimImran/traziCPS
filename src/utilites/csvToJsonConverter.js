import fs from 'fs';
import csvParser from 'csv-parser';

const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const data = {};
    fs.createReadStream(filePath)
      .pipe(csvParser({ headers: false }))
      .on('data', (row) => populateDataObject(data, row))
      .on('end', () => resolve(data))
      .on('error', (error) => reject(error));
  });
};

const populateDataObject = (data, row) => {
  const city = row[0];
  const state = row[1];
  const population = row[2];

  if (!city || !state || !population) return;

  const stateKey = state.trim().toLowerCase();
  const cityKey = city.trim().toLowerCase();

  if (!data[stateKey]) {
    data[stateKey] = {};
  }
  data[stateKey][cityKey] = parseInt(population);
};


const writeJSON = (filePath, data) => {
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFile(filePath, jsonString, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const groupCitiesByInitial = (cities) => {
  const grouped = {};
  for (const city in cities) {
    const initial = city.charAt(0).toLowerCase();
    if (!grouped[initial]) {
      grouped[initial] = {};
    }
    grouped[initial][city] = cities[city];
  }
  return grouped;
};

const writeGroupedCities = async (stateDir, groupedCities) => {
  for (const initial in groupedCities) {
    const filePath = `${stateDir}${initial}.json`;
    await writeJSON(filePath, groupedCities[initial]);
  }
};

const convertCSVtoJSON = async () => {
  try {
    const csvFilePath = './db/city_populations.csv';
    const data = await readCSV(csvFilePath);
    
    for (const state in data) {
      const stateDir = `./db/states/${state}/`;
      if (!fs.existsSync(stateDir)) {
        fs.mkdirSync(stateDir, { recursive: true });
      }

      const groupedCities = groupCitiesByInitial(data[state]);
      await writeGroupedCities(stateDir, groupedCities);
    }

    console.log('CSV to JSON conversion completed successfully!');
  } catch (error) {
    console.error('Error during CSV to JSON conversion:', error);
  }
};

export { convertCSVtoJSON };

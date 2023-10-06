import fs from 'fs';
import csvParser from 'csv-parser';

const readCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    const result = {};
    fs.createReadStream(filePath)
      .pipe(csvParser({ headers: false }))
      .on('data', (row) => {
        const city = row[0];
        const state = row[1];
        const population = row[2];

        if (state && city && population) {
          const stateKey = state.trim().toLowerCase();
          const cityKey = city.trim().toLowerCase();

          if (!result[stateKey]) {
            result[stateKey] = {};
          }
          result[stateKey][cityKey] = parseInt(population);
        }
      })
      .on('end', () => {
        resolve(result);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

const writeJSON = async (filePath, data) => {
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFile(filePath, jsonString, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const convertCSVtoJSON = async () => {
  try {
    const csvFilePath = './db/city_populations.csv';
    const data = await readCSV(csvFilePath);

    for (const stateKey of Object.keys(data)) {
      // Create directory for each state if it doesn't exist
      const stateDir = `./db/states/${stateKey}/`;
      if (!fs.existsSync(stateDir)) {
        fs.mkdirSync(stateDir, { recursive: true });
      }

      const groupedCities = {};
      
      for (const cityKey of Object.keys(data[stateKey])) {
        const initialCharofCity = cityKey.charAt(0).toLowerCase();
        if (!groupedCities[initialCharofCity]) {
          groupedCities[initialCharofCity] = {};
        }
        groupedCities[initialCharofCity][cityKey] = data[stateKey][cityKey];
      }

      for (const initialCharofCity of Object.keys(groupedCities)) {
        const jsonFilePath = `${stateDir}${initialCharofCity}.json`;
        await writeJSON(jsonFilePath, groupedCities[initialCharofCity]);
      }
    }

    console.log('CSV to JSON conversion completed successfully!');
  } catch (error) {
    console.error('Error during CSV to JSON conversion:', error);
  }
};

export { convertCSVtoJSON };
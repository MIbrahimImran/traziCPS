import fs from 'fs';
import csvParser from 'csv-parser';

const readCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    const result = {};
    fs.createReadStream(filePath)
      .pipe(csvParser({ headers: false }))
      .on('data', (row) => {
        const state = row[0];
        const city = row[1];
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
    const jsonFilePath = './db/data.json';
    const data = await readCSV(csvFilePath);
    await writeJSON(jsonFilePath, data);
    console.log('CSV data has been successfully converted to JSON and written to data.json');
  } catch (error) {
    console.error('Error during CSV to JSON conversion:', error);
  }
};


export { convertCSVtoJSON };
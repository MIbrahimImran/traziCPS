import fs from 'fs/promises';

class PopulationService {
  constructor() {
    this.cacheData = {};
  }

  async getPopulation(state, city) {
    const initialChar = city.charAt(0).toLowerCase();
    const loadedData = await this._loadData(state, initialChar);
    const population = loadedData[city];
    if (population === undefined) throw new Error('Invalid city provided for the given state');
    return population;
  }

  async setPopulation(state, city, population) {
    const initialChar = city.charAt(0).toLowerCase();
    const loadedData = await this._loadData(state, initialChar);
    const isNew = loadedData[city] === undefined;
    loadedData[city] = population;
    await this._writeDataToFile(state, initialChar, loadedData);
    const shardKey = this._getShardKey(state, initialChar);
    this.cacheData[shardKey] = loadedData;
    return isNew;
  }

  async _loadData(state, initialChar) {
    const shardKey = this._getShardKey(state, initialChar);
    if (!this.cacheData[shardKey]) {
      try {
        const rawData = await fs.readFile(`./db/states/${state}/${initialChar}.json`, 'utf8');
        this.cacheData[shardKey] = JSON.parse(rawData);
      } catch (error) {
        console.error(`Error loading data for ${shardKey}:`, error);
        throw new Error('Invalid state or city initial character provided');
      }
    }
    return this.cacheData[shardKey];
  }

  _getShardKey(state, initialChar) {
    return `${state}-${initialChar}`;
  }

  async _writeDataToFile(state, initialChar, data) {
    await fs.writeFile(`./db/states/${state}/${initialChar}.json`, JSON.stringify(data, null, 2))
    .catch(error => {
      console.error(`Error writing data for state ${state} and initial character ${initialChar}:`, error);
      throw error;
    });
  }
}

export default new PopulationService();
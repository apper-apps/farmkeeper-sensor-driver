import farmsData from "@/services/mockData/farms.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const farmService = {
  async getAll() {
    await delay(300);
    return [...farmsData];
  },

  async getById(id) {
    await delay(200);
    const farm = farmsData.find(farm => farm.Id === parseInt(id));
    if (!farm) {
      throw new Error("Farm not found");
    }
    return { ...farm };
  },

  async create(farmData) {
    await delay(400);
    const maxId = Math.max(...farmsData.map(f => f.Id), 0);
    const newFarm = {
      Id: maxId + 1,
      ...farmData,
      createdAt: new Date().toISOString()
    };
    farmsData.push(newFarm);
    return { ...newFarm };
  },

  async update(id, farmData) {
    await delay(300);
    const index = farmsData.findIndex(farm => farm.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Farm not found");
    }
    farmsData[index] = { ...farmsData[index], ...farmData };
    return { ...farmsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = farmsData.findIndex(farm => farm.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Farm not found");
    }
    farmsData.splice(index, 1);
    return true;
  }
};

export default farmService;
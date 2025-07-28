import cropsData from "@/services/mockData/crops.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const cropService = {
  async getAll() {
    await delay(300);
    return [...cropsData];
  },

  async getById(id) {
    await delay(200);
    const crop = cropsData.find(crop => crop.Id === parseInt(id));
    if (!crop) {
      throw new Error("Crop not found");
    }
    return { ...crop };
  },

  async getByFarm(farmId) {
    await delay(300);
    return cropsData.filter(crop => crop.farmId === farmId.toString()).map(crop => ({ ...crop }));
  },

  async create(cropData) {
    await delay(400);
    const maxId = Math.max(...cropsData.map(c => c.Id), 0);
    const newCrop = {
      Id: maxId + 1,
      ...cropData
    };
    cropsData.push(newCrop);
    return { ...newCrop };
  },

  async update(id, cropData) {
    await delay(300);
    const index = cropsData.findIndex(crop => crop.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    cropsData[index] = { ...cropsData[index], ...cropData };
    return { ...cropsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = cropsData.findIndex(crop => crop.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    cropsData.splice(index, 1);
    return true;
  }
};

export default cropService;
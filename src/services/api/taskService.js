import tasksData from "@/services/mockData/tasks.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasksData];
  },

  async getById(id) {
    await delay(200);
    const task = tasksData.find(task => task.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  },

  async getByFarm(farmId) {
    await delay(300);
    return tasksData.filter(task => task.farmId === farmId.toString()).map(task => ({ ...task }));
  },

  async create(taskData) {
    await delay(400);
    const maxId = Math.max(...tasksData.map(t => t.Id), 0);
    const newTask = {
      Id: maxId + 1,
      ...taskData
    };
    tasksData.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(300);
    const index = tasksData.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    tasksData[index] = { ...tasksData[index], ...taskData };
    return { ...tasksData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = tasksData.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    tasksData.splice(index, 1);
    return true;
  }
};

export default taskService;
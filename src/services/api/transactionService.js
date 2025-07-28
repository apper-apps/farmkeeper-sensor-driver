import transactionsData from "@/services/mockData/transactions.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const transactionService = {
  async getAll() {
    await delay(300);
    return [...transactionsData];
  },

  async getById(id) {
    await delay(200);
    const transaction = transactionsData.find(transaction => transaction.Id === parseInt(id));
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return { ...transaction };
  },

  async getByFarm(farmId) {
    await delay(300);
    return transactionsData.filter(transaction => transaction.farmId === farmId.toString()).map(transaction => ({ ...transaction }));
  },

  async create(transactionData) {
    await delay(400);
    const maxId = Math.max(...transactionsData.map(t => t.Id), 0);
    const newTransaction = {
      Id: maxId + 1,
      ...transactionData
    };
    transactionsData.push(newTransaction);
    return { ...newTransaction };
  },

  async update(id, transactionData) {
    await delay(300);
    const index = transactionsData.findIndex(transaction => transaction.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    transactionsData[index] = { ...transactionsData[index], ...transactionData };
    return { ...transactionsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = transactionsData.findIndex(transaction => transaction.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    transactionsData.splice(index, 1);
    return true;
  }
};

export default transactionService;
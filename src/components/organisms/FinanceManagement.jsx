import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import TransactionItem from "@/components/molecules/TransactionItem";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Chart from "react-apexcharts";
import transactionService from "@/services/api/transactionService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

const FinanceManagement = ({ selectedFarm }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filter, setFilter] = useState("all");

  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: "",
    description: ""
  });

  const expenseCategories = [
    { value: "seeds", label: "Seeds" },
    { value: "fertilizer", label: "Fertilizer" },
    { value: "equipment", label: "Equipment" },
    { value: "labor", label: "Labor" },
    { value: "fuel", label: "Fuel" },
    { value: "maintenance", label: "Maintenance" },
    { value: "other", label: "Other" }
  ];

  const incomeCategories = [
    { value: "harvest", label: "Harvest Sales" },
    { value: "sales", label: "Direct Sales" },
    { value: "subsidy", label: "Government Subsidy" },
    { value: "other", label: "Other Income" }
  ];

  const loadTransactions = async () => {
    if (!selectedFarm) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await transactionService.getByFarm(selectedFarm);
      setTransactions(data);
    } catch (err) {
      console.error("Error loading transactions:", err);
      setError("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [selectedFarm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFarm) {
      toast.error("Please select a farm first");
      return;
    }

    try {
      const transactionData = {
        ...formData,
        farmId: selectedFarm,
        amount: parseFloat(formData.amount)
      };

      if (editingTransaction) {
        await transactionService.update(editingTransaction.Id, transactionData);
        setTransactions(prev => prev.map(transaction => 
          transaction.Id === editingTransaction.Id ? { ...transaction, ...transactionData } : transaction
        ));
        toast.success("Transaction updated successfully!");
      } else {
        const newTransaction = await transactionService.create(transactionData);
        setTransactions(prev => [...prev, newTransaction]);
        toast.success("Transaction added successfully!");
      }

      setShowForm(false);
      setEditingTransaction(null);
      setFormData({
        type: "expense",
        category: "",
        amount: "",
        date: "",
        description: ""
      });
    } catch (err) {
      console.error("Error saving transaction:", err);
      toast.error("Failed to save transaction. Please try again.");
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      date: transaction.date.split("T")[0],
      description: transaction.description
    });
    setShowForm(true);
  };

  const handleDelete = async (transaction) => {
    if (!window.confirm(`Are you sure you want to delete this ${transaction.type}?`)) return;

    try {
      await transactionService.delete(transaction.Id);
      setTransactions(prev => prev.filter(t => t.Id !== transaction.Id));
      toast.success("Transaction deleted successfully!");
    } catch (err) {
      console.error("Error deleting transaction:", err);
      toast.error("Failed to delete transaction. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
    setFormData({
      type: "expense",
      category: "",
      amount: "",
      date: "",
      description: ""
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTransactions} />;

  if (!selectedFarm) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ApperIcon name="MapPin" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Farm Selected</h3>
          <p className="text-gray-500">Please select a farm to manage finances</p>
        </div>
      </div>
    );
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  // Calculate financial stats
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Current month stats
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const monthlyIncome = transactions
    .filter(t => t.type === "income" && new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = transactions
    .filter(t => t.type === "expense" && new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd)
    .reduce((sum, t) => sum + t.amount, 0);

  // Chart data for monthly trends
  const getMonthlyData = () => {
    const months = [];
    const incomeData = [];
    const expenseData = [];

    for (let i = 5; i >= 0; i--) {
      const month = subMonths(new Date(), i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      months.push(format(month, "MMM"));
      
      const income = transactions
        .filter(t => t.type === "income" && new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = transactions
        .filter(t => t.type === "expense" && new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd)
        .reduce((sum, t) => sum + t.amount, 0);
      
      incomeData.push(income);
      expenseData.push(expenses);
    }

    return { months, incomeData, expenseData };
  };

  const chartData = getMonthlyData();

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false }
    },
    colors: ["#4CAF50", "#EF5350"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded"
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      categories: chartData.months
    },
    yaxis: {
      title: {
        text: "Amount ($)"
      },
      labels: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toLocaleString()}`
      }
    }
  };

  const chartSeries = [
    {
      name: "Income",
      data: chartData.incomeData
    },
    {
      name: "Expenses", 
      data: chartData.expenseData
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const categoryOptions = formData.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-primary font-display">Finance Management</h1>
          <p className="text-gray-600">Track your farm income and expenses</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon="TrendingUp"
          color="success"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon="TrendingDown"
          color="error"
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(netProfit)}
          icon="DollarSign"
          color={netProfit >= 0 ? "success" : "error"}
          trend={netProfit >= 0 ? "up" : "down"}
          trendValue={netProfit >= 0 ? "Profitable" : "Loss"}
        />
        <StatCard
          title="Monthly Profit"
          value={formatCurrency(monthlyIncome - monthlyExpenses)}
          icon="Calendar"
          color={monthlyIncome - monthlyExpenses >= 0 ? "success" : "error"}
        />
      </div>

      {/* Monthly Trends Chart */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="BarChart3" size={20} />
              <span>Monthly Financial Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height="350"
            />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "All Transactions" },
          { value: "income", label: "Income" },
          { value: "expense", label: "Expenses" }
        ].map((filterOption) => (
          <Button
            key={filterOption.value}
            variant={filter === filterOption.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterOption.value)}
          >
            {filterOption.label}
          </Button>
        ))}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Transaction Type"
                      type="select"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      options={[
                        { value: "income", label: "Income" },
                        { value: "expense", label: "Expense" }
                      ]}
                      required
                    />
                    <FormField
                      label="Category"
                      type="select"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      options={categoryOptions}
                      required
                    />
                    <FormField
                      label="Amount"
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                    <FormField
                      label="Date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <FormField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of this transaction"
                    required
                  />
                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingTransaction ? "Update Transaction" : "Add Transaction"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <Empty
          icon="DollarSign"
          title="No transactions found"
          description={filter === "all" ? 
            "Start by adding your first transaction to track farm finances." :
            `No ${filter} transactions found.`
          }
          actionLabel="Add Transaction"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredTransactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((transaction, index) => (
            <motion.div
              key={transaction.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TransactionItem
                transaction={transaction}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FinanceManagement;
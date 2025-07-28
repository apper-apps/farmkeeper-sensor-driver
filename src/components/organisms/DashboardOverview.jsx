import React, { useEffect, useState } from "react";
import StatCard from "@/components/molecules/StatCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import cropService from "@/services/api/cropService";
import taskService from "@/services/api/taskService";
import transactionService from "@/services/api/transactionService";
import weatherService from "@/services/api/weatherService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { useNavigate } from "react-router-dom";

const DashboardOverview = ({ selectedFarm }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    crops: [],
    tasks: [],
    transactions: [],
    weather: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    if (!selectedFarm) {
      setData({ crops: [], tasks: [], transactions: [], weather: [] });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const [cropsData, tasksData, transactionsData, weatherData] = await Promise.all([
        cropService.getByFarm(selectedFarm),
        taskService.getByFarm(selectedFarm),
        transactionService.getByFarm(selectedFarm),
        weatherService.getForecast()
      ]);

      setData({
        crops: cropsData,
        tasks: tasksData,
        transactions: transactionsData,
        weather: weatherData
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedFarm]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (!selectedFarm) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ApperIcon name="MapPin" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Farm Selected</h3>
          <p className="text-gray-500 mb-4">Please select a farm to view dashboard data</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCrops = data.crops.length;
  const activeCrops = data.crops.filter(crop => crop.status === "growing" || crop.status === "planted").length;
  const pendingTasks = data.tasks.filter(task => !task.completed).length;
  const overdueTasks = data.tasks.filter(task => 
    !task.completed && isBefore(new Date(task.dueDate), new Date())
  ).length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyIncome = data.transactions
    .filter(t => t.type === "income" && 
             new Date(t.date).getMonth() === currentMonth && 
             new Date(t.date).getFullYear() === currentYear)
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = data.transactions
    .filter(t => t.type === "expense" && 
             new Date(t.date).getMonth() === currentMonth && 
             new Date(t.date).getFullYear() === currentYear)
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyProfit = monthlyIncome - monthlyExpenses;

  // Get upcoming tasks
  const upcomingTasks = data.tasks
    .filter(task => !task.completed && isAfter(new Date(task.dueDate), new Date()))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Get recent crops
  const recentCrops = data.crops
    .sort((a, b) => new Date(b.plantingDate) - new Date(a.plantingDate))
    .slice(0, 4);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Crops"
          value={totalCrops}
          icon="Sprout"
          color="secondary"
          trend={activeCrops > 0 ? "up" : undefined}
          trendValue={`${activeCrops} active`}
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon="CheckSquare"
          color={overdueTasks > 0 ? "error" : "primary"}
          trend={overdueTasks > 0 ? "down" : undefined}
          trendValue={overdueTasks > 0 ? `${overdueTasks} overdue` : "On track"}
        />
        <StatCard
          title="Monthly Profit"
          value={formatCurrency(monthlyProfit)}
          icon="DollarSign"
          color={monthlyProfit >= 0 ? "success" : "error"}
          trend={monthlyProfit >= 0 ? "up" : "down"}
          trendValue={`${formatCurrency(monthlyIncome)} income`}
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(monthlyExpenses)}
          icon="Receipt"
          color="warning"
          trendValue={`${data.transactions.filter(t => t.type === "expense").length} transactions`}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weather */}
        <div className="xl:col-span-1">
          <WeatherCard weatherData={data.weather} />
        </div>

        {/* Upcoming Tasks */}
        <div className="xl:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="CheckSquare" size={20} />
                  <span>Upcoming Tasks</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/tasks")}
                  className="text-primary hover:bg-primary/10"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="CheckCircle" size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming tasks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.Id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface/50 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-primary truncate">{task.title}</h4>
                        <p className="text-xs text-gray-500">Due: {format(new Date(task.dueDate), "MMM dd")}</p>
                      </div>
                      <div className="text-xs text-gray-400 capitalize">{task.priority}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Crops */}
        <div className="xl:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Sprout" size={20} />
                  <span>Recent Crops</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/crops")}
                  className="text-primary hover:bg-primary/10"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentCrops.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Sprout" size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No crops planted yet</p>
                  <Button
                    size="sm"
                    onClick={() => navigate("/crops")}
                    className="mt-2"
                  >
                    Add First Crop
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCrops.map((crop) => (
                    <div key={crop.Id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface/50 transition-colors">
                      <div className="flex-shrink-0">
                        <ApperIcon name="Sprout" size={16} className="text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-primary truncate">{crop.type}</h4>
                        <p className="text-xs text-gray-500">{crop.fieldLocation}</p>
                      </div>
                      <div className="text-xs text-gray-400 capitalize">{crop.status}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Zap" size={20} />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/crops")}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <ApperIcon name="Plus" size={24} className="text-secondary" />
              <span className="text-sm">Add Crop</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/tasks")}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <ApperIcon name="CheckSquare" size={24} className="text-primary" />
              <span className="text-sm">Create Task</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/finances")}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <ApperIcon name="DollarSign" size={24} className="text-success" />
              <span className="text-sm">Add Transaction</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/weather")}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <ApperIcon name="CloudSun" size={24} className="text-accent" />
              <span className="text-sm">Check Weather</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
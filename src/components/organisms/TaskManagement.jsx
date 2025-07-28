import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import TaskItem from "@/components/molecules/TaskItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import taskService from "@/services/api/taskService";
import cropService from "@/services/api/cropService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { format, isAfter, isBefore } from "date-fns";
import { createPortal } from "react-dom";
const TaskManagement = ({ selectedFarm }) => {
  const [tasks, setTasks] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    cropId: "",
    dueDate: "",
    priority: "medium",
    notes: ""
  });

  const taskTypes = [
    { value: "watering", label: "Watering" },
    { value: "fertilizing", label: "Fertilizing" },
    { value: "harvesting", label: "Harvesting" },
    { value: "planting", label: "Planting" },
    { value: "pruning", label: "Pruning" },
    { value: "weeding", label: "Weeding" },
    { value: "pest_control", label: "Pest Control" },
    { value: "other", label: "Other" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  const loadData = async () => {
    if (!selectedFarm) {
      setTasks([]);
      setCrops([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const [tasksData, cropsData] = await Promise.all([
        taskService.getByFarm(selectedFarm),
        cropService.getByFarm(selectedFarm)
      ]);
      setTasks(tasksData);
      setCrops(cropsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
      const taskData = {
        ...formData,
        farmId: selectedFarm,
        completed: false
      };

      if (editingTask) {
        await taskService.update(editingTask.Id, taskData);
        setTasks(prev => prev.map(task => 
          task.Id === editingTask.Id ? { ...task, ...taskData } : task
        ));
        toast.success("Task updated successfully!");
      } else {
        const newTask = await taskService.create(taskData);
        setTasks(prev => [...prev, newTask]);
        toast.success("Task added successfully!");
      }

      setShowForm(false);
      setEditingTask(null);
      setFormData({
        title: "",
        type: "",
        cropId: "",
        dueDate: "",
        priority: "medium",
        notes: ""
      });
    } catch (err) {
      console.error("Error saving task:", err);
      toast.error("Failed to save task. Please try again.");
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await taskService.update(task.Id, updatedTask);
      setTasks(prev => prev.map(t => 
        t.Id === task.Id ? updatedTask : t
      ));
      toast.success(task.completed ? "Task marked as incomplete" : "Task completed!");
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task. Please try again.");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      type: task.type,
      cropId: task.cropId || "",
      dueDate: task.dueDate.split("T")[0],
      priority: task.priority,
      notes: task.notes || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) return;

    try {
      await taskService.delete(task.Id);
      setTasks(prev => prev.filter(t => t.Id !== task.Id));
      toast.success("Task deleted successfully!");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({
      title: "",
      type: "",
      cropId: "",
      dueDate: "",
      priority: "medium",
      notes: ""
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (!selectedFarm) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ApperIcon name="MapPin" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Farm Selected</h3>
          <p className="text-gray-500">Please select a farm to manage tasks</p>
        </div>
      </div>
    );
  }

  const filteredTasks = tasks.filter(task => {
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    
    switch (filter) {
      case "pending":
        return !task.completed;
      case "completed":
        return task.completed;
      case "overdue":
        return !task.completed && isBefore(dueDate, now);
      case "today":
        return !task.completed && format(dueDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
      default:
        return true;
    }
  });

  const cropOptions = crops.map(crop => ({
    value: crop.Id.toString(),
    label: `${crop.type} - ${crop.fieldLocation}`
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-primary font-display">Task Management</h1>
          <p className="text-gray-600">Schedule and track your farm tasks</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "All Tasks" },
          { value: "pending", label: "Pending" },
          { value: "today", label: "Due Today" },
          { value: "overdue", label: "Overdue" },
          { value: "completed", label: "Completed" }
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
{/* Add/Edit Modal */}
      {showForm && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCancel();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            tabIndex={-1}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="shadow-2xl">
                <CardHeader className="relative">
                  <CardTitle>
                    {editingTask ? "Edit Task" : "Add New Task"}
                  </CardTitle>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="absolute right-4 top-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close modal"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Task Title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Water tomatoes in greenhouse"
                        required
                      />
                      <FormField
                        label="Task Type"
                        type="select"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        options={taskTypes}
                        required
                      />
                      <FormField
                        label="Related Crop (Optional)"
                        type="select"
                        name="cropId"
                        value={formData.cropId}
                        onChange={handleInputChange}
                        options={cropOptions}
                        placeholder="Select a crop"
                      />
                      <FormField
                        label="Due Date"
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Priority"
                        type="select"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        options={priorityOptions}
                        required
                      />
                    </div>
                    <FormField
                      label="Notes (Optional)"
                      type="textarea"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Additional details about this task..."
                    />
                    <div className="flex justify-end space-x-3">
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingTask ? "Update Task" : "Add Task"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          description={filter === "all" ? 
            "Start by adding your first task to keep track of farm activities." :
            `No ${filter} tasks found.`
          }
          actionLabel="Add New Task"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TaskItem
                task={task}
                onToggleComplete={handleToggleComplete}
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

export default TaskManagement;
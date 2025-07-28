import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import CropCard from "@/components/molecules/CropCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import cropService from "@/services/api/cropService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";

const CropManagement = ({ selectedFarm }) => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [filter, setFilter] = useState("all");

const [formData, setFormData] = useState({
    Name: "",
    type: "",
    variety: "",
    plantingDate: "",
    fieldLocation: "",
    status: "planted",
    expectedHarvest: ""
  });

  const cropTypes = [
    { value: "corn", label: "Corn" },
    { value: "tomato", label: "Tomato" },
    { value: "potato", label: "Potato" },
    { value: "carrot", label: "Carrot" },
    { value: "lettuce", label: "Lettuce" },
    { value: "beans", label: "Beans" },
    { value: "wheat", label: "Wheat" },
    { value: "rice", label: "Rice" },
    { value: "soybean", label: "Soybean" }
  ];

  const statusOptions = [
    { value: "planted", label: "Planted" },
    { value: "growing", label: "Growing" },
    { value: "harvested", label: "Harvested" },
    { value: "failed", label: "Failed" }
  ];

  const loadCrops = async () => {
    if (!selectedFarm) {
      setCrops([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await cropService.getByFarm(selectedFarm);
      setCrops(data);
    } catch (err) {
      console.error("Error loading crops:", err);
      setError("Failed to load crops. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
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
      const cropData = {
        ...formData,
        Name: formData.Name || `${formData.type} - ${formData.variety}`.trim(),
        farmId: selectedFarm
      };

      if (editingCrop) {
        await cropService.update(editingCrop.Id, cropData);
        setCrops(prev => prev.map(crop => 
          crop.Id === editingCrop.Id ? { ...crop, ...cropData } : crop
        ));
        toast.success("Crop updated successfully!");
      } else {
        const newCrop = await cropService.create(cropData);
        if (newCrop) {
          setCrops(prev => [...prev, newCrop]);
          toast.success("Crop added successfully!");
        }
      }

      setShowForm(false);
      setEditingCrop(null);
      setFormData({
        Name: "",
        type: "",
        variety: "",
        plantingDate: "",
        fieldLocation: "",
        status: "planted",
        expectedHarvest: ""
      });
    } catch (err) {
      console.error("Error saving crop:", err);
      toast.error("Failed to save crop. Please try again.");
    }
  };

const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      Name: crop.Name || "",
      type: crop.type,
      variety: crop.variety,
      plantingDate: crop.plantingDate.split("T")[0],
      fieldLocation: crop.fieldLocation,
      status: crop.status,
      expectedHarvest: crop.expectedHarvest ? crop.expectedHarvest.split("T")[0] : ""
    });
    setShowForm(true);
  };

  const handleDelete = async (crop) => {
    if (!window.confirm(`Are you sure you want to delete ${crop.type}?`)) return;

    try {
      await cropService.delete(crop.Id);
      setCrops(prev => prev.filter(c => c.Id !== crop.Id));
      toast.success("Crop deleted successfully!");
    } catch (err) {
      console.error("Error deleting crop:", err);
      toast.error("Failed to delete crop. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
setEditingCrop(null);
    setFormData({
      Name: "",
      type: "",
      variety: "",
      plantingDate: "",
      fieldLocation: "",
      status: "planted",
      expectedHarvest: ""
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCrops} />;

  if (!selectedFarm) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ApperIcon name="MapPin" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Farm Selected</h3>
          <p className="text-gray-500">Please select a farm to manage crops</p>
        </div>
      </div>
    );
  }

  const filteredCrops = crops.filter(crop => {
    if (filter === "all") return true;
    return crop.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-primary font-display">Crop Management</h1>
          <p className="text-gray-600">Track and manage your farm crops</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add New Crop
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "All Crops" },
          { value: "planted", label: "Planted" },
          { value: "growing", label: "Growing" },
          { value: "harvested", label: "Harvested" }
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
{/* Modal for Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCancel();
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>
                    {editingCrop ? "Edit Crop" : "Add New Crop"}
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancel}
                    className="h-8 w-8 p-0"
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </CardHeader>
                <CardContent>
<form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Name"
                        name="Name"
                        value={formData.Name}
                        onChange={handleInputChange}
                        placeholder="Enter crop name"
                        required
                      />
                      <FormField
                        label="Crop Type"
                        type="select"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        options={cropTypes}
                        required
                      />
                      <FormField
                        label="Variety"
                        name="variety"
                        value={formData.variety}
                        onChange={handleInputChange}
                        placeholder="e.g., Sweet Corn, Cherry Tomato"
                        required
                      />
                      <FormField
                        label="Field Location"
                        name="fieldLocation"
                        value={formData.fieldLocation}
                        onChange={handleInputChange}
                        placeholder="e.g., North Field, Greenhouse 1"
                        required
                      />
                      <FormField
                        label="Planting Date"
                        type="date"
                        name="plantingDate"
                        value={formData.plantingDate}
                        onChange={handleInputChange}
                        required
                      />
                      <FormField
                        label="Expected Harvest Date"
                        type="date"
                        name="expectedHarvest"
                        value={formData.expectedHarvest}
                        onChange={handleInputChange}
                      />
                      <FormField
                        label="Status"
                        type="select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        options={statusOptions}
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingCrop ? "Update Crop" : "Add Crop"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <Empty
          icon="Sprout"
          title="No crops found"
          description={filter === "all" ? 
            "Start by adding your first crop to track its growth and progress." :
            `No crops with status "${filter}" found.`
          }
          actionLabel="Add New Crop"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredCrops.map((crop, index) => (
            <motion.div
              key={crop.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <CropCard
                crop={crop}
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

export default CropManagement;
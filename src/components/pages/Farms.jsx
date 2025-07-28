import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Label from '@/components/atoms/Label';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import FormField from '@/components/molecules/FormField';
import farmService from '@/services/api/farmService';
import { cn } from '@/utils/cn';

const Farms = ({ selectedFarm }) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFarmData, setSelectedFarmData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    type: 'crop',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError('');
      const farmsData = await farmService.getAll();
      setFarms(farmsData);
    } catch (err) {
      setError('Failed to load farms. Please try again.');
      console.error('Error loading farms:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Farm name is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.size || formData.size <= 0) errors.size = 'Valid size is required';
    if (!formData.type) errors.type = 'Farm type is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const newFarm = await farmService.create({
        ...formData,
        size: parseFloat(formData.size)
      });
      setFarms(prev => [...prev, newFarm]);
      setShowCreateModal(false);
      resetForm();
      toast.success('Farm created successfully!');
    } catch (err) {
      toast.error('Failed to create farm. Please try again.');
      console.error('Error creating farm:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateFarm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const updatedFarm = await farmService.update(selectedFarmData.Id, {
        ...formData,
        size: parseFloat(formData.size)
      });
      setFarms(prev => prev.map(farm => 
        farm.Id === selectedFarmData.Id ? updatedFarm : farm
      ));
      setShowEditModal(false);
      resetForm();
      toast.success('Farm updated successfully!');
    } catch (err) {
      toast.error('Failed to update farm. Please try again.');
      console.error('Error updating farm:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFarm = async () => {
    try {
      setSubmitting(true);
      await farmService.delete(selectedFarmData.Id);
      setFarms(prev => prev.filter(farm => farm.Id !== selectedFarmData.Id));
      setShowDeleteModal(false);
      setSelectedFarmData(null);
      toast.success('Farm deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete farm. Please try again.');
      console.error('Error deleting farm:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      size: '',
      type: 'crop',
      description: ''
    });
    setFormErrors({});
    setSelectedFarmData(null);
  };

  const openEditModal = (farm) => {
    setSelectedFarmData(farm);
setFormData({
      name: farm.Name || farm.name,
      location: farm.location,
      size: farm.size.toString(),
      tags: farm.Tags || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (farm) => {
    setSelectedFarmData(farm);
    setShowDeleteModal(true);
  };

  const filteredFarms = farms
    .filter(farm => 
      farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'size':
          return b.size - a.size;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadFarms} />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farm Management</h1>
          <p className="text-gray-600 mt-1">Manage and organize your farms</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={20} />
          Create Farm
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search farms by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon="Search"
          />
        </div>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sm:w-48"
        >
          <option value="name">Sort by Name</option>
          <option value="location">Sort by Location</option>
          <option value="size">Sort by Size</option>
          <option value="type">Sort by Type</option>
        </Select>
      </div>

      {filteredFarms.length === 0 ? (
        <Empty
          title="No farms found"
          description={searchTerm ? "No farms match your search criteria." : "Create your first farm to get started."}
          action={
            !searchTerm && (
              <Button onClick={() => setShowCreateModal(true)}>
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Create Farm
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => (
<Card key={farm.Id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    selectedFarm === farm.Id.toString() ? "bg-primary text-white" : "bg-surface"
                  )}>
                    <ApperIcon name="MapPin" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{farm.name}</h3>
                    <p className="text-sm text-gray-600">{farm.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(farm)}
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteModal(farm)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{farm.size} acres</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{farm.type}</span>
                </div>
                {farm.description && (
                  <div className="text-sm text-gray-600 pt-2 border-t">
                    <p className="line-clamp-2">{farm.description}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Farm Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Create New Farm</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleCreateFarm} className="space-y-4">
                <FormField
                  label="Farm Name"
                  type="text"
                  placeholder="Enter farm name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  error={formErrors.name}
                  required
                />

                <FormField
                  label="Location"
                  type="text"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  error={formErrors.location}
                  required
                />

                <FormField
                  label="Size (acres)"
                  type="number"
                  placeholder="Enter size in acres"
                  value={formData.size}
                  onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                  error={formErrors.size}
                  required
                  min="0"
                  step="0.1"
                />

                <div>
                  <Label>Farm Type</Label>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className={cn("w-full", formErrors.type && "border-error")}
                  >
                    <option value="crop">Crop Farm</option>
                    <option value="livestock">Livestock Farm</option>
                    <option value="mixed">Mixed Farm</option>
                    <option value="orchard">Orchard</option>
                    <option value="vineyard">Vineyard</option>
                  </Select>
                  {formErrors.type && (
                    <p className="text-error text-sm mt-1">{formErrors.type}</p>
                  )}
                </div>

                <FormField
                  label="Description (Optional)"
                  type="textarea"
                  placeholder="Enter farm description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? 'Creating...' : 'Create Farm'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Farm Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Edit Farm</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleUpdateFarm} className="space-y-4">
                <FormField
                  label="Farm Name"
                  type="text"
                  placeholder="Enter farm name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  error={formErrors.name}
                  required
                />

                <FormField
                  label="Location"
                  type="text"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  error={formErrors.location}
                  required
                />

                <FormField
                  label="Size (acres)"
                  type="number"
                  placeholder="Enter size in acres"
                  value={formData.size}
                  onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                  error={formErrors.size}
                  required
                  min="0"
                  step="0.1"
                />

                <div>
                  <Label>Farm Type</Label>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className={cn("w-full", formErrors.type && "border-error")}
                  >
                    <option value="crop">Crop Farm</option>
                    <option value="livestock">Livestock Farm</option>
                    <option value="mixed">Mixed Farm</option>
                    <option value="orchard">Orchard</option>
                    <option value="vineyard">Vineyard</option>
                  </Select>
                  {formErrors.type && (
                    <p className="text-error text-sm mt-1">{formErrors.type}</p>
                  )}
                </div>

                <FormField
                  label="Description (Optional)"
                  type="textarea"
                  placeholder="Enter farm description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? 'Updating...' : 'Update Farm'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedFarmData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-error/10 rounded-lg">
                  <ApperIcon name="AlertTriangle" size={24} className="text-error" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Delete Farm</h2>
                  <p className="text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{selectedFarmData.name}</strong>? 
                This will permanently remove the farm and all associated data.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedFarmData(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteFarm}
                  disabled={submitting}
                  className="flex-1 bg-error hover:bg-error/90"
                >
                  {submitting ? 'Deleting...' : 'Delete Farm'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Farms;
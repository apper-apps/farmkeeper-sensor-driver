import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Farms from "@/components/pages/Farms";
import Crops from "@/components/pages/Crops";
import Tasks from "@/components/pages/Tasks";
import Finances from "@/components/pages/Finances";
import Weather from "@/components/pages/Weather";
import farmService from "@/services/api/farmService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
function App() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError("");
      const farmsData = await farmService.getAll();
      setFarms(farmsData);
      
      // Auto-select first farm if available
      if (farmsData.length > 0 && !selectedFarm) {
        setSelectedFarm(farmsData[0].Id.toString());
      }
    } catch (err) {
      console.error("Error loading farms:", err);
      setError("Failed to load farms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const handleFarmChange = (farmId) => {
    setSelectedFarm(farmId);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadFarms} />;

  return (
    <div className="min-h-screen bg-background font-body">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-col min-h-screen">
        <Header 
          selectedFarm={selectedFarm}
          farms={farms}
          onFarmChange={handleFarmChange}
          onToggleSidebar={toggleSidebar}
        />
        
        <main className="flex-1 lg:pl-64">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
<Routes>
              <Route path="/" element={<Dashboard selectedFarm={selectedFarm} />} />
              <Route path="/farms" element={<Farms selectedFarm={selectedFarm} />} />
              <Route path="/crops" element={<Crops selectedFarm={selectedFarm} />} />
              <Route path="/tasks" element={<Tasks selectedFarm={selectedFarm} />} />
              <Route path="/finances" element={<Finances selectedFarm={selectedFarm} />} />
              <Route path="/weather" element={<Weather />} />
            </Routes>
          </div>
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </div>
  );
}

export default App;
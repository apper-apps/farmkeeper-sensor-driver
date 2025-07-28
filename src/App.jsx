import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from '@/store/store';
import { setUser, clearUser } from '@/store/userSlice';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import Dashboard from '@/components/pages/Dashboard';
import Farms from '@/components/pages/Farms';
import Crops from '@/components/pages/Crops';
import Tasks from '@/components/pages/Tasks';
import Finances from '@/components/pages/Finances';
import Weather from '@/components/pages/Weather';
import Login from '@/components/pages/Login';
import Signup from '@/components/pages/Signup';
import Callback from '@/components/pages/Callback';
import ErrorPage from '@/components/pages/ErrorPage';
import ResetPassword from '@/components/pages/ResetPassword';
import PromptPassword from '@/components/pages/PromptPassword';
import farmService from '@/services/api/farmService';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

// Create auth context
export const AuthContext = createContext(null);

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Get authentication status
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        setIsInitialized(true);
      }
    });
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError("");
      const farmsData = await farmService.getAll();
      setFarms(farmsData);
      
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
    if (isAuthenticated && isInitialized) {
      loadFarms();
    }
  }, [isAuthenticated, isInitialized]);

  const handleFarmChange = (farmId) => {
    setSelectedFarm(farmId);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-screen w-full">
      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path>
      </svg>
    </div>;
  }

return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
        <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
        <Route path="/" element={
          isAuthenticated ? (
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
                    {loading ? <Loading /> : error ? <Error message={error} onRetry={loadFarms} /> : (
                      <Dashboard selectedFarm={selectedFarm} />
                    )}
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
          ) : <Loading />
        } />
        <Route path="/farms" element={
          isAuthenticated ? (
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
                    {loading ? <Loading /> : error ? <Error message={error} onRetry={loadFarms} /> : (
                      <Farms selectedFarm={selectedFarm} />
                    )}
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
          ) : <Loading />
        } />
        <Route path="/crops" element={
          isAuthenticated ? (
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
                    {loading ? <Loading /> : error ? <Error message={error} onRetry={loadFarms} /> : (
                      <Crops selectedFarm={selectedFarm} />
                    )}
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
          ) : <Loading />
        } />
        <Route path="/tasks" element={
          isAuthenticated ? (
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
                    {loading ? <Loading /> : error ? <Error message={error} onRetry={loadFarms} /> : (
                      <Tasks selectedFarm={selectedFarm} />
                    )}
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
          ) : <Loading />
        } />
        <Route path="/finances" element={
          isAuthenticated ? (
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
                    {loading ? <Loading /> : error ? <Error message={error} onRetry={loadFarms} /> : (
                      <Finances selectedFarm={selectedFarm} />
                    )}
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
          ) : <Loading />
        } />
        <Route path="/weather" element={
          isAuthenticated ? (
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
                    {loading ? <Loading /> : error ? <Error message={error} onRetry={loadFarms} /> : (
                      <Weather />
                    )}
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
          ) : <Loading />
        } />
      </Routes>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
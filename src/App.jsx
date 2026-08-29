import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Welcome from "./pages/welcome";
import Dashboard from "./pages/Dashboard";
import ProvinceDetailsPage from "./pages/ProvinceDetailsPage";
import Ecosimulator from "./pages/Ecosimulator";
import IncidentReporter from "./pages/IncidentReporter";
import ReportsComparison from "./pages/ReportsComparison";
import Aboutproject from "./pages/Aboutproject";
import Contact from "./pages/Contact";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* الصفحة الرئيسية الأولى */}
        <Route
          path="/"
          element={<Welcome />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        {/* Province Details */}
        <Route
          path="/provinces"
          element={
            <AppLayout>
              <ProvinceDetailsPage />
            </AppLayout>
          }
        />

        {/* Eco Simulator */}
        <Route
          path="/simulator"
          element={
            <AppLayout>
              <Ecosimulator />
            </AppLayout>
          }
        />

        {/* Incident Reporter */}
        <Route
          path="/reporter"
          element={
            <AppLayout>
              <IncidentReporter />
            </AppLayout>
          }
        />

        {/* Reports & Comparison */}
        <Route
          path="/reports"
          element={
            <AppLayout>
              <ReportsComparison />
            </AppLayout>
          }
        />

        {/* أي رابط غير معروف */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

        <Route path="/about" element={<Aboutproject />} />
         <Route path="/contact" element={<Contact />} />

      </Routes>
    </BrowserRouter>
  );
}


function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveItem = (pathname) => {
    if (pathname.startsWith("/provinces")) {
      return "Province Details";
    }

    if (pathname.startsWith("/simulator")) {
      return "Eco Simulator";
    }

    if (pathname.startsWith("/reporter")) {
      return "Incident Reporter";
    }

    if (pathname.startsWith("/reports")) {
      return "Reports & Comparison";
    }

    return "Dashboard";
  };

  const activeItem = getActiveItem(location.pathname);

  const handleNavigate = (item) => {
    if (item?.path) {
      navigate(item.path);
    }
  };

  return (
    <MainLayout
      activeItem={activeItem}
      onNavigate={handleNavigate}
      title={activeItem}
      subtitle="Environmental Intelligence"
    >
      {children}
    </MainLayout>
  );
}


export default App;
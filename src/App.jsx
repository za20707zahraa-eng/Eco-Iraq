import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import ProvinceDetailsPage from "./pages/ProvinceDetailsPage";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveItem = (pathname) => {
    if (pathname === "/") {
      return "Dashboard";
    }

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
    navigate(item.path);
  };

  return (
    <MainLayout
      activeItem={activeItem}
      onNavigate={handleNavigate}
      title={activeItem}
      subtitle="Environmental Intelligence"
    >
      <Routes>
        {/* Dashboard */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* Province Details */}
        <Route
          path="/provinces"
          element={<ProvinceDetailsPage />}
        />

        {/* Eco Simulator */}
        <Route
          path="/simulator"
          element={
            <PagePlaceholder
              title="Eco Simulator"
              description="Simulate environmental solutions and compare results."
            />
          }
        />

        {/* Incident Reporter */}
        <Route
          path="/reporter"
          element={
            <PagePlaceholder
              title="Incident Reporter"
              description="Report and track environmental incidents."
            />
          }
        />

        {/* Reports & Comparison */}
        <Route
          path="/reports"
          element={
            <PagePlaceholder
              title="Reports & Comparison"
              description="Compare environmental scores and analyze Iraq provinces."
            />
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Dashboard />}
        />
      </Routes>
    </MainLayout>
  );
}

function PagePlaceholder({
  title,
  description,
}) {
  return (
    <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-6">
      <div
        className="
          w-full
          max-w-xl
          rounded-3xl
          border
          border-white/[0.07]
          bg-white/[0.035]
          p-8
          text-center
          shadow-[0_25px_80px_rgba(0,0,0,0.20)]
          backdrop-blur-2xl
        "
      >
        <div
          className="
            mx-auto
            mb-5
            h-2
            w-16
            rounded-full
            bg-[#4FE0CF]
            shadow-[0_0_25px_rgba(79,224,207,0.35)]
          "
        />

        <h2 className="text-2xl font-semibold text-white">
          {title}
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
          {description}
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
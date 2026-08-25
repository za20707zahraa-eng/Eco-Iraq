import { useState } from "react";

import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";

function App() {
  const [activeItem, setActiveItem] =
    useState("Dashboard");

  const handleNavigate = (item) => {
    setActiveItem(item.label);
  };

  return (
    <MainLayout
      activeItem={activeItem}
      onNavigate={handleNavigate}
      title={activeItem}
      subtitle="Environmental Intelligence"
    >
      <Dashboard />
    </MainLayout>
  );
}

export default App;

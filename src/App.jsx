import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/welcome";
import Dashboard from "./pages/Dashboard";
import EcoSimulator from "./pages/Ecosimulator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/province" element={<EcoSimulator />} />
        <Route path="/province/:id" element={<EcoSimulator />} />
      </Routes>
    </Router>
  );
}

export default App;

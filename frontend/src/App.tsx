import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import NeuralBackground from "./components/NeuralBackground";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <NeuralBackground />
      <div className="grid-overlay" />
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

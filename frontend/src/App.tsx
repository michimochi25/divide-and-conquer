import "./App.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AccountPage />} />
    </Routes>
  );
}

export default App;

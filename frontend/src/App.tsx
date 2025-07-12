import "./App.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import ClassLayout from "./pages/ClassLayout";
import AccountLayout from "./pages/AccountLayout";
import ClassesPage from "./pages/ClassesPage";
import ClassPage from "./pages/ClassPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/user/:userId" element={<AccountLayout />}>
        <Route index element={<AccountPage />} />
        <Route path="classes" element={<ClassLayout />}>
          <Route index element={<ClassesPage />} />
          <Route path=":classId" element={<ClassPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

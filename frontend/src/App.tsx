import "./App.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AccountPage from "./pages/AccountPage";
import ClassLayout from "./pages/ClassLayout";
import AccountLayout from "./pages/AccountLayout";
import ClassesPage from "./pages/ClassesPage";
import ClassPage from "./pages/ClassPage";
import RegisterPage from "./pages/RegisterPage";
import GooglePage from "./pages/GooglePage";
import QuestionPage from "./pages/QuestionPage";
import DialoguePage from "./pages/DialoguePage";
import AuthWrapper from "./AuthWrapper";
import ProtectedRoute from "./pages/ProtectedRoute";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/signin"
        element={
          <AuthWrapper>
            <GooglePage />
          </AuthWrapper>
        }
      />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/question"
        element={
          <AuthWrapper>
            <ProtectedRoute>
              <QuestionPage />
            </ProtectedRoute>
          </AuthWrapper>
        }
      />
      <Route
        path="/dialogue"
        element={
          <AuthWrapper>
            <ProtectedRoute>
              <DialoguePage />
            </ProtectedRoute>
          </AuthWrapper>
        }
      />
      <Route
        path="/user/:userId"
        element={
          <AuthWrapper>
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          </AuthWrapper>
        }
      >
        <Route index element={<AccountPage />} />
        <Route path="classes" element={<ClassLayout />}>
          <Route index element={<ClassesPage />} />
          <Route path=":classId" element={<ClassPage />} />
        </Route>
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;

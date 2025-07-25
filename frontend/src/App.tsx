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
import UnauthenticatedPage from "./pages/UnauthenticatedPage";
import { useState } from "react";
import { ErrorContainer } from "./components/ErrorContainer";
import GameLayout from "./pages/GameLayout";
import { EditComponent } from "./components/EditComponent";
import { EditForm } from "./components/EditForm";

function App() {
  const [error, setError] = useState<string>("");
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AuthWrapper>
              <LandingPage />
            </AuthWrapper>
          }
        />
        <Route
          path="/signin"
          element={
            <AuthWrapper>
              <GooglePage />
            </AuthWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <AuthWrapper>
              <RegisterPage />
            </AuthWrapper>
          }
        />
        <Route
          path="/:classId/chapter/:chapterId"
          element={
            <AuthWrapper>
              <GameLayout />
            </AuthWrapper>
          }
        >
          <Route path="question" element={<QuestionPage />} />
          <Route path="dialogue" element={<DialoguePage />} />
        </Route>
        <Route
          path="/user/:userId"
          element={
            <AuthWrapper>
              <AccountLayout />
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
      {error.length !== 0 && <ErrorContainer message={error} />}
    </>
  );
}

export default App;

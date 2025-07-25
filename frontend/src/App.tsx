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
import ErrorPage from "./pages/ErrorPage";
import { ErrorContainer } from "./components/ErrorContainer";
import GameLayout from "./pages/GameLayout";
import { useErrorContext } from "./ErrorContext";

function App() {
  const { errorMsg } = useErrorContext();

  return (
    <>
      {errorMsg.length !== 0 && (
        <div className="absolute z-999 w-screen h-screen top-0">
          <ErrorContainer message={errorMsg} alert={true} />
        </div>
      )}
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
    </>
  );
}

export default App;

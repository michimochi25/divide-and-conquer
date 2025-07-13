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

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthWrapper>
            {/* <UnauthenticatedPage> */}
            <LandingPage />
            {/* </UnauthenticatedPage> */}
          </AuthWrapper>
        }
      />
      <Route
        path="/signin"
        element={
          <AuthWrapper>
            {/* <UnauthenticatedPage> */}
            <GooglePage />
            {/* </UnauthenticatedPage> */}
          </AuthWrapper>
        }
      />
      <Route
        path="/register"
        element={
          <AuthWrapper>
            {/* <UnauthenticatedPage> */}
            <RegisterPage />
            {/* </UnauthenticatedPage> */}
          </AuthWrapper>
        }
      />
      <Route
        path="/:classId/chapter/:classId/question"
        element={
          <AuthWrapper>
            {/* <ProtectedRoute> */}
            <QuestionPage />
            {/* </ProtectedRoute> */}
          </AuthWrapper>
        }
      />
      <Route
        path="/:classId/chapter/:classId/dialogue"
        element={
          <AuthWrapper>
            {/* <ProtectedRoute> */}
            <DialoguePage />
            {/* </ProtectedRoute> */}
          </AuthWrapper>
        }
      />
      <Route
        path="/user/:userId"
        element={
          <AuthWrapper>
            {/* <ProtectedRoute> */}
            <AccountLayout />
            {/* </ProtectedRoute> */}
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

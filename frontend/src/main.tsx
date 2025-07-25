import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChapterProvider } from "./ChapterContext.tsx";
import { SceneProvider } from "./SceneContext.tsx";
import AuthWrapper from "./AuthWrapper.tsx";
import { ErrorProvider } from "./ErrorContext.tsx";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
  throw new Error("GOOGLE_CLIENT_ID environment variable is not set.");
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <ErrorProvider>
        <ChapterProvider>
          <SceneProvider>
            <GoogleOAuthProvider clientId={clientId}>
              <App />
            </GoogleOAuthProvider>
          </SceneProvider>
        </ChapterProvider>
      </ErrorProvider>
    </StrictMode>
  </BrowserRouter>
);

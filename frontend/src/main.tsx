import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./AuthContext.tsx";
import { ChapterProvider } from "./ChapterContext.tsx";
import { SceneProvider } from "./SceneContext.tsx";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
  throw new Error("GOOGLE_CLIENT_ID environment variable is not set.");
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <ChapterProvider>
          <SceneProvider>
            <GoogleOAuthProvider clientId={clientId}>
              <App />
            </GoogleOAuthProvider>
          </SceneProvider>
        </ChapterProvider>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>
);

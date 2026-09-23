import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./app/globals.css";
import "./app/lawxygen-v3.css";
import "./app/navbar-final.css";
import "./app/service-mega-light.css";
import "./app/service-showcase-tune.css";
import "./app/login-modal.css";
import "./app/client-home.css";
import "./app/home-client-final.css";
import "./app/home-ux-compact.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  </GoogleOAuthProvider>,
);

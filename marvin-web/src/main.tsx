import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Rubik: the rounded geometric lettering closest to the Marvin Studio logo.
import "@fontsource-variable/rubik";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

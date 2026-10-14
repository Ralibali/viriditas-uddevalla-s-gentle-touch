import "./lib/initGa4";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;
// A prerendered page has already played its entrance; the app replaces it without replaying it.
if (root.hasChildNodes()) document.documentElement.classList.add("is-prerendered");
createRoot(root).render(<App />);

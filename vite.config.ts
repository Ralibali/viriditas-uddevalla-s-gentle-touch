import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const projectId = process.env.VITE_SUPABASE_PROJECT_ID ?? "rrnlxpdxbyzclhkwnkal";
const supabaseUrl = process.env.VITE_SUPABASE_URL ?? `https://${projectId}.supabase.co`;
const supabasePublishableKey =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybmx4cGR4Ynl6Y2xoa3dua2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NTU4MDAsImV4cCI6MjA4OTIzMTgwMH0.ypjTZxvcedCxdkhIpiiWGc0HzCijayUaBExRFZch_lk";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(projectId),
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(supabasePublishableKey),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
}));

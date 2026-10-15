import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Public Supabase project settings. The anon key is a publishable key: it only
// grants what row level security allows. Set VITE_SUPABASE_URL and
// VITE_SUPABASE_PUBLISHABLE_KEY (in .env or the environment) to use another project.
const DEFAULT_PROJECT_ID = "rrnlxpdxbyzclhkwnkal";
const DEFAULT_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybmx4cGR4Ynl6Y2xoa3dua2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NTU4MDAsImV4cCI6MjA4OTIzMTgwMH0.ypjTZxvcedCxdkhIpiiWGc0HzCijayUaBExRFZch_lk";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const projectId = env.VITE_SUPABASE_PROJECT_ID || DEFAULT_PROJECT_ID;
  const supabaseUrl = env.VITE_SUPABASE_URL || `https://${projectId}.supabase.co`;
  const supabasePublishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_PUBLISHABLE_KEY;

  return {
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(supabasePublishableKey),
    },
    server: {
      host: "::",
      port: 8080,
      hmr: { overlay: false },
    },
    plugins: [react()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
      dedupe: ["react", "react-dom", "react/jsx-runtime"],
    },
    build: {
      rollupOptions: {
        output: {
          // Keep the framework in its own long-cached chunk.
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
          },
        },
      },
    },
  };
});

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
//import { auth } from "./src/firebase";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "ES2020",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          firebase: ["firebase/app", "firebase/auth"],
          icons: ["lucide-react"]
        }
      }
    }
  }
});

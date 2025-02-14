import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: parseInt(process.env.VITE_PORT || "3001"),
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer], // Use ES module imports for PostCSS plugins
    },
  },
});

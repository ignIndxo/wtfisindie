import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://wtfisindie.club",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
});

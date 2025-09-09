import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Get repository name from environment or use default
const repoName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] || "next-boilerplate";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? `/${repoName}/` : "/",
});

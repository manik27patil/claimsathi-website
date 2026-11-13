import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        login: "auth/login.html",
        register: "auth/register.html",
        dashboard: "auth/dashboard.html",
        "forgot-password": "auth/forgot-password.html",
        "reset-password": "auth/reset-password.html",
        "email-verify": "auth/email-verify.html",
      },
    },
  },
});

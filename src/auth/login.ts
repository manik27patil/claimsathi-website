import { supabase } from "../supabase";
import { signIn, initAuth, subscribeAuth } from "../auth";
import { showError, hideError, setLoading, validateEmail } from "./ui";

initAuth();

subscribeAuth((state) => {
  if (state.user && !state.loading) {
    window.location.href = "/auth/dashboard.html";
  }
});

document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError("login-error");

  const email = (document.getElementById("email") as HTMLInputElement).value.trim();
  const password = (document.getElementById("password") as HTMLInputElement).value;

  if (!validateEmail(email)) {
    showError("login-error", "Please enter a valid email address.");
    return;
  }
  if (!password) {
    showError("login-error", "Please enter your password.");
    return;
  }

  setLoading("login-btn", true, "Signing in...");

  const { error } = await signIn(email, password);

  if (error) {
    setLoading("login-btn", false);
    if (error.includes("Invalid login credentials")) {
      showError("login-error", "Incorrect email or password. Please try again.");
    } else {
      showError("login-error", error);
    }
    return;
  }

  // Redirect happens via auth state listener
});

document.getElementById("forgot-link")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/auth/forgot-password.html";
});

document.getElementById("register-link")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/auth/register.html";
});

document.getElementById("back-home")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/";
});

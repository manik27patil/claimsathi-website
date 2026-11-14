import { signUp, initAuth, subscribeAuth } from "../auth";
import { showError, hideError, setLoading, validateEmail, validateMobile, validatePassword } from "./ui";

initAuth();

subscribeAuth((state) => {
  if (state.user && !state.loading) {
    window.location.href = "/auth/dashboard.html";
  }
});

document.getElementById("register-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError("register-error");
  hideError("register-success");

  const fullName = (document.getElementById("full-name") as HTMLInputElement).value.trim();
  const email = (document.getElementById("email") as HTMLInputElement).value.trim();
  const mobile = (document.getElementById("mobile") as HTMLInputElement).value.trim();
  const password = (document.getElementById("password") as HTMLInputElement).value;
  const confirmPassword = (document.getElementById("confirm-password") as HTMLInputElement).value;
  const termsChecked = (document.getElementById("terms-check") as HTMLInputElement).checked;

  if (!fullName || fullName.length < 2) {
    showError("register-error", "Please enter your full name.");
    return;
  }
  if (!validateEmail(email)) {
    showError("register-error", "Please enter a valid email address.");
    return;
  }
  if (!validateMobile(mobile)) {
    showError("register-error", "Please enter a valid mobile number (10-13 digits).");
    return;
  }
  const pwCheck = validatePassword(password);
  if (!pwCheck.valid) {
    showError("register-error", pwCheck.message);
    return;
  }
  if (password !== confirmPassword) {
    showError("register-error", "Passwords do not match.");
    return;
  }
  if (!termsChecked) {
    showError("register-error", "Please accept the Terms and Privacy Policy to continue.");
    return;
  }

  setLoading("register-btn", true, "Creating account...");

  const { error } = await signUp(fullName, email, mobile, password);

  if (error) {
    setLoading("register-btn", false);
    if (error.includes("already registered") || error.includes("already been registered")) {
      showError("register-error", "An account with this email already exists. Please sign in instead.");
    } else if (error.includes("password")) {
      showError("register-error", "Password does not meet security requirements.");
    } else {
      showError("register-error", error);
    }
    return;
  }

  setLoading("register-btn", false);
  const successEl = document.getElementById("register-success");
  const successMsg = document.getElementById("register-success-msg");
  if (successEl && successMsg) {
    successMsg.textContent = "Account created successfully! Redirecting to sign in...";
    successEl.style.display = "flex";
  }

  setTimeout(() => {
    window.location.href = "/auth/email-verify.html";
  }, 1500);
});

document.getElementById("login-link")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/auth/login.html";
});

document.getElementById("back-home")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/";
});

import { signOut, initAuth, subscribeAuth } from "../auth";

initAuth();

subscribeAuth((state) => {
  const loading = document.getElementById("loading-screen");
  const content = document.getElementById("dashboard-content");

  if (state.loading) return;

  if (!state.user) {
    window.location.href = "/auth/login.html";
    return;
  }

  if (loading) loading.style.display = "none";
  if (content) content.classList.remove("hidden");

  const name = state.profile?.full_name || state.user.email?.split("@")[0] || "Policyholder";
  const email = state.user.email || "—";
  const mobile = state.profile?.mobile_number || "—";

  const userNameEl = document.getElementById("user-name");
  const userEmailEl = document.getElementById("user-email");
  const welcomeNameEl = document.getElementById("welcome-name");
  const profileNameEl = document.getElementById("profile-name");
  const profileEmailEl = document.getElementById("profile-email");
  const profileMobileEl = document.getElementById("profile-mobile");

  if (userNameEl) userNameEl.textContent = name;
  if (userEmailEl) userEmailEl.textContent = email;
  if (welcomeNameEl) welcomeNameEl.textContent = name;
  if (profileNameEl) profileNameEl.textContent = name;
  if (profileEmailEl) profileEmailEl.textContent = email;
  if (profileMobileEl) profileMobileEl.textContent = mobile;
});

document.getElementById("logout-btn")?.addEventListener("click", async () => {
  await signOut();
  window.location.href = "/auth/login.html";
});

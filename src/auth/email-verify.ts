document.getElementById("login-link")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/auth/login.html";
});

document.getElementById("back-home")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/";
});

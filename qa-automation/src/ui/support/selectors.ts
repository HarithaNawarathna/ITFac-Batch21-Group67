export const LoginSelectors = {
  usernameInput: 'input[name="username"]',
  passwordInput: 'input[name="password"]',
  loginButton: 'button[type="submit"]',

  usernameError: 'input[name="username"] + .invalid-feedback',
  passwordError: 'input[name="password"] + .invalid-feedback',

  // Bootstrap alerts / toasts (fallbacks)
  alert: '.alert, .toast, [role="alert"]'
};

export const LogoutSelectors = {
  // left nav / header logout button (covers button or link text)
  logoutButton: 'button:has-text("Logout"), a:has-text("Logout")',
};

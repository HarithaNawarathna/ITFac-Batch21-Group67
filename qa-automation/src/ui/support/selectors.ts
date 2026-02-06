export const LoginSelectors = {
  usernameInput: 'input[name="username"]',
  passwordInput: 'input[name="password"]',
  loginButton: 'button[type="submit"]',

  usernameError: 'input[name="username"] + .invalid-feedback',
  passwordError: 'input[name="password"] + .invalid-feedback',

  // Bootstrap alerts / toasts (fallbacks)
  alert: '.alert, .toast, [role="alert"]'
};

export const SalesSelectors = {
  table: "table",
  pagination: ".pagination"
};

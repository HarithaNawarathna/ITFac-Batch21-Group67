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

export const SalesSelectors = {
  table: "table",
  pagination: ".pagination"
};

/**
 * Category selectors — one per element, copied from app HTML.
 *
 * List page:
 *   - Search: input placeholder="Search sub category"
 *   - Add: <a href="/ui/categories/add">Add A Category</a>
 *   - Table: <table class="table table-striped table-bordered">, thead.table-dark
 *     Columns: ID (sort link), Name (sort link), Parent (sort link), Actions
 *     Row: <td>id</td><td>name</td><td>parent</td><td>Edit link + Delete form</td>
 *   - Edit: <a href="/ui/categories/edit/{id}" title="Edit">
 *   - Delete: <button title="Delete"> inside form action="/ui/categories/delete/{id}"
 *
 * Add category page:
 *   - Name: <input id="name" name="name"> (use #name so list search input is not matched)
 *   - Parent: <select id="parentId" name="parentId">
 *   - Save: <button type="submit" class="btn btn-primary">Save</button>
 */
export const CategorySelectors = {
  // List page
  addCategoryButton: 'a[href="/ui/categories/add"]',
  searchCategoryInput: 'input[placeholder="Search sub category"]',
  searchButton: 'button:has-text("Search")',
  resetLink: 'a.btn-outline-secondary[href="/ui/categories"]',
  categoriesTable: 'table.table.table-striped.table-bordered',
  sortByIdLink: 'table thead a[href*="sortField=id"]',
  sortByNameLink: 'table thead a[href*="sortField=name"]',
  sortByParentLink: 'table thead a[href*="sortField=parent.name"]',
  deleteButton: 'button[title="Delete"]',
  firstDeleteButton: 'table tbody tr:first-child button[title="Delete"]',
  // Add/edit page
  categoryNameInput: 'input#name',
  parentCategorySelect: 'select#parentId',
  saveCategoryButton: 'button[type="submit"]',
  successMessage: '.alert-success, .toast-success, .toast-body, [role="alert"]',
  nameRequiredError: 'input#name + .invalid-feedback',
  editButton: 'a[title="Edit"]',
  firstEditButton: 'table tbody tr:first-child a[title="Edit"]',
};

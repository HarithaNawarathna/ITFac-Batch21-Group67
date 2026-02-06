export const ROUTES = {
  // API Routes
  AUTH_LOGIN: "/api/auth/login",

  CATEGORIES: "/api/categories",
  CATEGORIES_SUMMARY: "/api/categories/summary",
  CATEGORIES_MAIN: "/api/categories/main",

  PLANTS: "/api/plants",
  PLANTS_SUMMARY: "/api/plants/summary",

  SALES_PLANT: "/api/sales/plant",
  SALES: "/api/sales",
  SALES_PAGE: "/api/sales/page",

  HEALTH: "/api/health",

  // UI Routes
  UI_LOGIN: "/ui/login",
  UI_DASHBOARD: "/ui/dashboard",
  UI_CATEGORIES: "/ui/categories",
  UI_PLANTS: "/ui/plants",
  UI_PLANTS_ADD: "/ui/plants/add",
  UI_SALES: "/ui/sales",
  UI_SALES_NEW: "/ui/sales/new",
} as const;
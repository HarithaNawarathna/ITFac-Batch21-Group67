import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "@playwright/test";
import type { LoginPage } from "../pages/auth/login.page.js";
import type { SalesPage } from "../pages/sales/sales.page.js";
import { ENV } from "../../config/env.js";
import { LoginPage as LoginPageClass } from "../pages/auth/login.page.js";
import { BasePage } from "../pages/base.page.js";
import type { PretestIds } from "../../shared/utils/pretest-ids.js";

export interface UIWorldState {
  selectedPlantId(selectedPlantId: any): unknown;
  quantitySold: any;
  initialStock: any;
  loginPage?: LoginPage;
  salesPage?: SalesPage;
  createdPlantName?: string;
  updatedPlantName?: string;
  selectedPlantName?: string;
  deletedPlantName?: string;
  /** IDs created by API @pretest (from world or pretest-ids.json). */
  pretestIds?: PretestIds | null;
}

export class UIWorld extends World {
  declare page: Page;
  declare context: BrowserContext;
  declare browser: Browser;
  state: UIWorldState = {
    selectedPlantId: function (selectedPlantId: any): unknown {
      throw new Error("Function not implemented.");
    },
    quantitySold: undefined,
    initialStock: undefined,
    pretestIds: undefined,
  };

  constructor(options: IWorldOptions) {
    super(options);
  }

  async loginAs(role: string) {
    const login = new LoginPageClass(this.page);
    await login.open();
    
    if (role === "admin") {
      await login.login(ENV.USERS.admin.username, ENV.USERS.admin.password);
    } 
    else if (role === "testuser" || role === "user") {
      await login.login(ENV.USERS.user.username, ENV.USERS.user.password);
    }
    
    // Wait for dashboard
    const dashboard = new BasePage(this.page);
    await dashboard.expectOnDashboard();
  }
}

// Set the World constructor for Cucumber
setWorldConstructor(UIWorld);

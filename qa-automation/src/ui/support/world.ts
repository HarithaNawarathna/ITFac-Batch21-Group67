import {
  IWorldOptions,
  setWorldConstructor,
  World,
} from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "@playwright/test";
import type { LoginPage } from "../pages/auth/login.page";

export interface UIWorldState {
  loginPage?: LoginPage;
}

export class UIWorld extends World {
  declare page: Page;
  declare context: BrowserContext;
  declare browser: Browser;
  state: UIWorldState = {};

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(UIWorld);

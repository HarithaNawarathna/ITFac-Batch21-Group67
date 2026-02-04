import {
  IWorldOptions,
  setWorldConstructor,
  World,
} from "@cucumber/cucumber";
import { AxiosResponse } from "axios";

export class APIWorld extends World {
  lastResponse: AxiosResponse | null = null;
  authToken: string | null = null;
  /** Set when a category is created so After hook can delete it. */
  createdCategoryId: string | null = null;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(APIWorld);

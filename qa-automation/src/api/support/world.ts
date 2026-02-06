import {
  IWorldOptions,
  setWorldConstructor,
  World,
} from "@cucumber/cucumber";
import { AxiosResponse } from "axios";

export class APIWorld extends World {
  lastResponse: AxiosResponse | null = null;
  authToken: string | null = null;
  createdCategoryId: string | null = null;
  saleIdToFetch: string | null = null;

  plantId: number | null = null;
  initialPlantStock: number | null = null;
  quantitySold: number | null = null;
  createdSaleId: string | null = null;
  createdSaleIds: string[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(APIWorld);

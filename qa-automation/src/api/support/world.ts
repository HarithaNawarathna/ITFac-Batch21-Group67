import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import { AxiosResponse } from "axios";

// Extend AxiosResponse to include expectedRole (optional)
export interface AxiosResponseWithRole extends AxiosResponse {
  expectedRole?: string;
}

export class APIWorld extends World {
  lastResponse: AxiosResponse | null = null;
  authToken: string | null = null;

  // Use extended type so we can store expectedRole per login response
  multipleResponses: AxiosResponseWithRole[] = [];

  /** Set when a category is created so After hook can delete it. */
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

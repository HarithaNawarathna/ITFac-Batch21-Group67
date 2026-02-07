import { createPlant } from "../clients/plants.client.js";

export interface CreatePlantForTestOptions {
  name?: string;
  price?: number;
  quantity?: number;
}

/**
 * Creates a plant for test setup (e.g. delete CRUD). Use in a Given step so the scenario
 * can then delete or update that plant. Returns the API response; caller should read
 * response.data.id and set world.createdPlantId (and optionally world.createdCategoryId
 * if a category was created for this plant).
 */
export async function createPlantForTest(
  token: string,
  categoryId: number,
  options: CreatePlantForTestOptions = {}
): Promise<Awaited<ReturnType<typeof createPlant>>> {
  const unique = Date.now();
  const name = options.name ?? `Plant-For-Test-${unique}`;
  const price = options.price ?? 100;
  const quantity = options.quantity ?? 10;

  return createPlant(token, {
    name,
    categoryId,
    price,
    quantity,
  });
}

import fs from "fs";
import path from "path";

export interface PretestIds {
  parentCategoryId: string;
  categoryId: string;
  plantId: string;
  saleId: string;
}

const PRETEST_IDS_PATH = path.resolve("src/shared/testdata/pretest-ids.json");

/**
 * Read pretest-created IDs from the file written by the @pretest Before hook.
 * Use this in API or UI steps when you need category/plant/sale IDs but the
 * pretest ran in a different scenario or in a separate run.
 */
export function readPretestIds(): PretestIds | null {
  try {
    const raw = fs.readFileSync(PRETEST_IDS_PATH, "utf-8");
    const data = JSON.parse(raw) as PretestIds;
    if (
      data.parentCategoryId != null &&
      data.categoryId != null &&
      data.plantId != null &&
      data.saleId != null
    ) {
      return data;
    }
  } catch {
    // File missing or invalid
  }
  return null;
}

/**
 * Write pretest IDs to the shared file so API/UI scenarios can use them
 * (e.g. when running in separate Cucumber runs).
 */
export function writePretestIds(ids: PretestIds): void {
  const dir = path.dirname(PRETEST_IDS_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(PRETEST_IDS_PATH, JSON.stringify(ids, null, 2), "utf-8");
}

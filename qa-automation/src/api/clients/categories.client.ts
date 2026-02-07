import axios, { AxiosResponse } from "axios";
import { ENV } from "../../config/env.js";
import { ROUTES } from "../../config/routes.js";

const baseURL = ENV.API_BASE_URL;

export interface GetCategoriesParams {
  page?: number;
  size?: number;
  search?: string;
  parentId?: number;
  sort?: string;
}

/** Used by "I create a category with name" – sends { name } only (success/failure/validation scenarios). */
export async function createCategory(
  name: string,
  token: string
): Promise<AxiosResponse> {
  return axios.post(
    `${baseURL}${ROUTES.CATEGORIES}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

/** Full payload the API expects for a root category. Used by "a category exists" (setup for update/delete). */
const ROOT_PARENT = { id: null, name: null, parent: null } as const;

/** Creates a root category with full payload { id, name, parent }. Use for test setup (e.g. "a category exists"); use createCategory for create success/failure scenarios. */
export async function createRootCategoryForTest(
  name: string,
  token: string
): Promise<AxiosResponse> {
  const body = {
    id: null,
    name,
    parent: ROOT_PARENT,
  };
  return axios.post(
    `${baseURL}${ROUTES.CATEGORIES}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function createSubcategoryForTest(
  name: string,
  parentId: number,
  token: string
): Promise<AxiosResponse> {
  const body = {
    name,
    parent: { id: parentId },
  };
  return axios.post(
    `${baseURL}${ROUTES.CATEGORIES}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function getCategories(
  token: string,
  params?: GetCategoriesParams
): Promise<AxiosResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.size != null) searchParams.set("size", String(params.size));
  if (params?.search != null) searchParams.set("search", params.search);
  if (params?.parentId != null)
    searchParams.set("parentId", String(params.parentId));
  if (params?.sort != null) searchParams.set("sort", params.sort);
  const query = searchParams.toString();
  const url = query
    ? `${baseURL}${ROUTES.CATEGORIES}?${query}`
    : `${baseURL}${ROUTES.CATEGORIES}`;
  return axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateCategory(
  id: string,
  name: string,
  parentId: string,
  token: string
): Promise<AxiosResponse> {
  return axios.put(
    `${baseURL}${ROUTES.CATEGORIES}/${id}`,
    { name, parentId: Number(parentId) },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function deleteCategory(
  id: string,
  token: string
): Promise<AxiosResponse> {
  return axios.delete(`${baseURL}${ROUTES.CATEGORIES}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

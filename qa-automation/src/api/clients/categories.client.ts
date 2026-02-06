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
  token: string
): Promise<AxiosResponse> {
  return axios.put(
    `${baseURL}${ROUTES.CATEGORIES}/${id}`,
    { name },
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

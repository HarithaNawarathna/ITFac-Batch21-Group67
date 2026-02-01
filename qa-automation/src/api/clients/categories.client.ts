import axios, { AxiosResponse } from "axios";
import { ENV } from "../../config/env.js";
import { ROUTES } from "../../config/routes.js";

const baseURL = ENV.API_BASE_URL;

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

export async function deleteCategory(
  id: string,
  token: string
): Promise<AxiosResponse> {
  return axios.delete(`${baseURL}${ROUTES.CATEGORIES}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

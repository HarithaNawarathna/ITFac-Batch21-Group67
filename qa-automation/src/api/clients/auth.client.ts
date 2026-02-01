import axios, { AxiosResponse } from "axios";
import { ENV } from "../../config/env.js";
import { ROUTES } from "../../config/routes.js";

const baseURL = ENV.API_BASE_URL;

export async function login(
  username: string,
  password: string
): Promise<AxiosResponse> {
  return axios.post(`${baseURL}${ROUTES.AUTH_LOGIN}`, {
    username,
    password,
  });
}

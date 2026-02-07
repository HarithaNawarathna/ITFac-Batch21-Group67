import axios, { AxiosResponse } from "axios";
import { ENV } from "../../config/env.js";
import { ROUTES } from "../../config/routes.js";
import type { APIWorld } from "../support/world.js";
import { expect } from "@playwright/test";

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
export async function authenticateAdmin(world: APIWorld): Promise<void> {
  const creds = ENV.USERS.admin;

  const response = await login(creds.username, creds.password);
  expect(response.status).toBe(200);

  const data = response.data as Record<string, unknown>;
  world.authToken = data.token as string;

  expect(world.authToken).toBeTruthy();
  world.lastResponse = response;
}

export async function authenticateUser(world: APIWorld): Promise<void> {
  const creds = ENV.USERS.user;

  const response = await login(creds.username, creds.password);
  expect(response.status).toBe(200);

  const data = response.data as Record<string, unknown>;
  world.authToken = data.token as string;

  expect(world.authToken).toBeTruthy();
  world.lastResponse = response;
}


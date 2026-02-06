import axios, { AxiosResponse } from "axios";
import { ENV } from "../../config/env.js";
import { ROUTES } from "../../config/routes.js";

const baseURL = ENV.API_BASE_URL;

export async function getPlants(token: string): Promise<AxiosResponse> {
  return axios.get(
    `${baseURL}${ROUTES.PLANTS}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}

export async function createPlant(
  token: string,
  plantData: { name: string; categoryId: number; price: number; quantity: number }
): Promise<AxiosResponse> {
  const { categoryId, name, price, quantity } = plantData;
  
  return axios.post(
    `${baseURL}/api/plants/category/${categoryId}`,
    {
      name,
      price,
      quantity
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function updatePlant(
  token: string,
  plantId: number,
  plantData: { name: string; price: number; quantity: number }
): Promise<AxiosResponse> {
  return axios.put(
    `${baseURL}/api/plants/${plantId}`,
    plantData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function getPlantById(
  token: string,
  plantId: number
): Promise<AxiosResponse> {
  return axios.get(
    `${baseURL}/api/plants/${plantId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}

export async function deletePlant(
  token: string,
  plantId: number
): Promise<AxiosResponse> {
  return axios.delete(
    `${baseURL}/api/plants/${plantId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}

export async function getPlantsByCategory(
  endpoint: string,
  token: string
): Promise<AxiosResponse> {
  return axios.get(
    `${baseURL}${endpoint}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}
import axios, { AxiosResponse } from "axios";
import { ENV } from "../../config/env.js";
import { ROUTES } from "../../config/routes.js";

const baseURL = ENV.API_BASE_URL;

export async function sellPlant(
	plantId: number,
	quantity: number,
	token: string
): Promise<AxiosResponse> {
	return axios.post(`${baseURL}${ROUTES.SALES_PLANT}/${plantId}`, null, {
		params: { quantity },
		headers: {
			Authorization: `Bearer ${token}`,
			accept: "*/*",
		},
	});
}

export async function getAllSales(token: string): Promise<AxiosResponse> {
	return axios.get(`${baseURL}${ROUTES.SALES}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			accept: "*/*",
		},
	});
}

export async function deleteSale(
	id: string | number,
	token: string
): Promise<AxiosResponse> {
	return axios.delete(`${baseURL}${ROUTES.SALES}/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			accept: "*/*",
		},
	});
}

export async function getSaleById(
	id: string | number,
	token: string
): Promise<AxiosResponse> {
	return axios.get(`${baseURL}${ROUTES.SALES}/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			accept: "*/*",
		},
	});
}

export async function getSalesPage(
	page: number,
	size: number,
	token: string,
	sort?: string
): Promise<AxiosResponse> {
	return axios.get(`${baseURL}${ROUTES.SALES_PAGE}`, {
		params: {
			page,
			size,
			sort,
		},
		headers: {
			Authorization: `Bearer ${token}`,
			accept: "*/*",
		},
	});
}


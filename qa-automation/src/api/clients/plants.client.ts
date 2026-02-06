import axios, { AxiosResponse } from "axios";
import { ENV } from "../../config/env.js";
import { ROUTES } from "../../config/routes.js";

const baseURL = ENV.API_BASE_URL;

export async function getPlantById(
	id: number | string,
	token?: string
): Promise<AxiosResponse> {
	return axios.get(`${baseURL}${ROUTES.PLANTS}/${id}`, {
		headers: token ? { Authorization: `Bearer ${token}` } : undefined,
	});
}


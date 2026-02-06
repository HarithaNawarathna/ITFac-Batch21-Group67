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


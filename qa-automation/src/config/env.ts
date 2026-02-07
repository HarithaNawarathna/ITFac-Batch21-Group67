import * as dotenv from "dotenv";
dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const ENV = {
  UI_BASE_URL: required("UI_BASE_URL"),
  API_BASE_URL: required("API_BASE_URL"),

  DB_HOST: required("DB_HOST"),
  DB_USER: required("DB_USER"),
  DB_PASSWORD: required("DB_PASSWORD"),
  DB_NAME: required("DB_NAME"),

  USERS: {
    admin: {
      username: required("ADMIN_USERNAME"),
      password: required("ADMIN_PASSWORD")
    },
    user: {
      username: required("USER_USERNAME"),
      password: required("USER_PASSWORD")
    }
  }
};

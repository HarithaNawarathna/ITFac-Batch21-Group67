import { AfterAll } from "@cucumber/cucumber";
import mysql from "mysql2/promise";
import { ENV } from "../../config/env.js";

AfterAll(async function () {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: `${ENV.DB_HOST}`,
      user: `${ENV.DB_USER}`,
      password: `${ENV.DB_PASSWORD}`,
      database: `${ENV.DB_NAME}`,
      multipleStatements: true,
    });

    console.log("[posttest] Running database cleanup...");

    await connection.query(`
      SET FOREIGN_KEY_CHECKS = 0;
      TRUNCATE TABLE sales;
      TRUNCATE TABLE inventory;
      TRUNCATE TABLE plants;
      TRUNCATE TABLE categories;
      SET FOREIGN_KEY_CHECKS = 1;
    `);

    console.log("[posttest] Database cleanup completed");
  } catch (err) {
    console.error("[posttest] Database cleanup failed", err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

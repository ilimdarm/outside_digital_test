import Sequelize from "sequelize"
import dotenv from "dotenv/config"

export const db = new Sequelize("database", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: "postgres"
})
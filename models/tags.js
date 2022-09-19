import Sequelize from "sequelize"
import { db } from "../db.js"


export const tags = db.define('tags', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    creator: {
        type: Sequelize.UUID,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING(40),
        allowNull: false
    },
    sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes:[
        {
            unique: true,
            fields: ['id']
        },
    ]
})

tags.sync()
// tags.sync({force: true})
import Sequelize from "sequelize"
import { db } from "../db.js"


export const usertags = db.define('usertags', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user: {
        type: Sequelize.UUID,
        allowNull: false
    },
    tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
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

usertags.sync()
// tags.sync({force: true})
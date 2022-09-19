import Sequelize from "sequelize"
import { db } from "../db.js"

export const users = db.define('users', {
    uid: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING(100),
        validate:{
	        isEmail: true,
        }
    },
    password: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    nickname: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    token: {
        type: Sequelize.STRING(),
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes:[
        {
            unique: true,
            fields: ['uid']
        },
    ]
})

users.sync()
// users.sync({force: true})
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Op } from "sequelize"
import { users } from "../models/users.js"
import { v1 as uuidv1 } from "uuid"
import { tags } from "../models/tags.js"

export const createUser = async (body, callback) => {
    await users.findOne({
        where:{
            [Op.or]: [
                {nickname: body.nickname},
                {email: body.email}
            ]
        }
    }).then(async (result) => {
        if(result){
            return callback({
                error_code: 1,
                msg: 'Пользователь уже существует!'
            })
        }
        body.uid = await uuidv1()
        body.password = await bcrypt.hash(body.password, 3)
        const token = await jwt.sign({ nickname: body.nickname, email: body.email }, process.env.JWT_PRIVATE_KEY, { expiresIn: 1800 })
        let res = await users.create(body)
        if (!res){
            return callback({
                error_code: 3,
                msg: "Не удалось создать пользователя!"
            })
        }
        await users.update(
            {token: token},
            { where: { nickname: body.nickname }}
        )
        return callback({
            token,
            expire: 1800
        })
    })
}

export const authUser = async (body, callback) => {
    await users.findOne({
        where: {email: body.email}
    }).then(async (result) => {
        if(!result){
            return callback({
                error_code: 4,
                error: 'Почта не зарегистрирована!'
            })
        }
        let check_pass = await bcrypt.compare(body.password, result.password)
        if (!check_pass){
            return callback({
                error_code: 5,
                error: 'Неверный пароль!'
            })
        }
        const token = await jwt.sign({ nickname: result.nickname, email: result.email }, process.env.JWT_PRIVATE_KEY, { expiresIn: 1800 })
        
        await users.update(
            {token: token},
            { where: { uid: result.uid }}
        )
        return callback({
            token,
            expire: 1800
        })
    })
}

export const logoutUser = async (token, callback) => {
    await users.update(
        {token: null},
        { where: { token }}
    )
    return callback({
        success: 1
    })
}

export const getUser = async (user, callback) => {
    
    let user_tags = await tags.findAll({
        attributes: ['id', 'name', 'sortOrder'],
        where: {creator: user.uid}
    })
    
    return callback({
        email: user.email,
        nickname: user.nickname,
        tags: user_tags
    })
}

export const putUser = async (body, callback) => {
    await users.findOne({
        where:{
            [Op.or]: [
                {nickname: body.nickname},
                {email: body.email}
            ]
        }
    }).then(async (result) => {
        if(result){
            return callback({
                error_code: 1,
                msg: 'Пользователь уже существует!'
            })
        }
        body.uid = await uuidv1()
        body.password = await bcrypt.hash(body.password, 3)
        let res = await users.create(body)
        if (!res){
            return callback({
                error_code: 3,
                msg: "Не удалось создать пользователя!"
            })
        }

        return callback({
            email: body.email,
            nickname: body.nickname,
        })
    })
}

export const deleteUser = async (token, callback) => {
    let res = await users.destroy({
        where: { token }
    })
    if (!res){
        return callback({
            error_code: 3,
            msg: "Не удалось удалить пользователя!"
        })
    }

    return callback({
        success: 1
    })
}


export const updateToken = async (user, callback) => {
    
    const token = await jwt.sign({ nickname: user.nickname, email: user.email }, process.env.JWT_PRIVATE_KEY, { expiresIn: 1800 })
    
    await users.update(
        {token: token},
        { where: { uid: user.uid }}
    )
    return callback({
        token,
        expire: 1800
    })
}


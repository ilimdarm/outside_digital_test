import { users } from "../models/users.js"


export const checkTokenTime = async (token) =>{
    let exp = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).exp
    if (exp < Date.now())
        return false
    return true
}

export const checkTokenValid = async (token) =>{
    let user = await users.findOne({ where: {token}})
    if(!user){
        return false
    }
    return user
}
import { Op, where } from "sequelize"
import { users } from "../models/users.js"
import { tags } from "../models/tags.js"
import { usertags } from "../models/usertags.js"

export const createTag = async (body, callback) => {
    let checkTag = await tags.findOne({
        where:{
            [Op.and]: [{name: body.name},{creator: body.user.uid}]
        }
    })
    if (checkTag){
        return callback({
            error: 'Тег с таким именем уже существует!'
        })
    }
    body.creator = body.user.uid
    let creator_nickname = body.user.nickname
    delete body.user
    let res = await tags.create(body)
    if (!res){
        return callback({
            error_code: 3,
            msg: "Не удалось создать тег!"
        })
    }
    
    return callback({
        name: body.name,
        creator: creator_nickname
    })
}

export const getTag = async (id, callback) => {
    let tag = await tags.findOne({
        where:{ id }
    })
    if (!tag){
        return callback({
            error: 'Тега с таким id не существует!'
        })
    }

    let user = await users.findOne({
        where: {uid: tag.creator}
    })
    
    return callback({
        creator: {
            nickname: user.nickname,
            uid: user.uid
        },
        name: tag.name,
        sortOrder: tag.sortOrder
    })
}

export const getTagsList = async (body, callback) => {
    let sort = []

    if (body.sortByOrder){
        sort = ['sortOrder', 'DESC']
    }
    if (body.sortByName){
        sort = ['name', 'DESC']
    }

    await tags.findAll({
        offset: body.offset, limit: body.length,
        order: [
            sort
        ]
    }).then(async result =>{

        let res = []

        for (let i = 0; i < result.length; i++){
            let user = await users.findOne({
                where: {uid: result[i].creator}
            })
            res.push({
                creator: {
                    nickname: user.nickname,
                    uid: user.uid
                },
                name: result[i].name,
                sortOrder: result[i].sortOrder
            })
        }
        let all_tags = await tags.findAndCountAll()

        return callback({
            data: res,
            meta: {
                offset: body.offset,
                length: body.length,
                quantity: all_tags.count
            }
        })
    })
    
}

export const updateTag = async (body, callback) => {
    await tags.findOne(
        { where: { id: body.id }}
    ).then(async result =>{
        if (!result){
            return callback({
                error: 'Тега с таким id не существует!'
            })
        }
        let user = await users.findOne({
            where: {uid: result.creator}
        })
        if (result.creator != body.user.uid){
            return callback({
                error: 'Вы не владелец тега'
            })
        }

        let name = body.name?body.name:result.name
        let sortOrder = body.sortOrder?body.sortOrder:result.sortOrder

        await tags.update(
            {name, sortOrder},
            {where: {id: result.id}}
        )
        
        return callback({
            creator: {
                nickname: user.nickname,
                uid: user.uid
            },
            name: body.name,
            sortOrder: body.sortOrder
        })
    })
}

export const deleteTag = async (body, callback) => {
    await tags.findOne(
        { where: { id: body.id }}
    ).then(async result =>{
        if (!result){
            return callback({
                error: 'Тега с таким id не существует!'
            })
        }
        if (result.creator != body.user.uid){
            return callback({
                error: 'Вы не владелец тега'
            })
        }
        await tags.destroy({
            where: {id: body.id}
        })

        await usertags.destroy({
            where: {tag_id: body.id}
        })

        return callback({
            success: 1
        })
    })
}


import { Op } from "sequelize"
import { tags } from "../models/tags.js"
import { usertags } from "../models/usertags.js"

export const addTag = async (body, callback) => {
    let tags_obj = []
    for (let i = 0; i < body.tags_list.length; i++){
        tags_obj.push({
            id: body.tags_list[i]
        })
    }
    await tags.findAll({
        where:{
            [Op.or]: tags_obj
        }
    }).then(async result => {
        if (!result){
            return callback({
                error: 'Тега с таким id не существует!'
            })
        }
        if (result.length != body.tags_list.length){
            return callback({
                error: 'Невозможно добавить теги, некорректные id'
            })
        }
        let tags_to_add = []

        for (let i = 0; i < result.length; i++){
            tags_to_add.push({
                user: body.user.uid,
                tag_id: result[i].id
            })
        }

        let tt = await usertags.findAll()
        
        let res = await usertags.bulkCreate(
            tags_to_add,
            {ignoreDuplicates: true}
        )
        if (!res){
            return callback({
                error_code: 3,
                msg: "Не удалось добавить тег!"
            })
        }

        let updated_list = await usertags.findAll({
            attributes: ['tag_id'],
            where: {user: body.user.uid}
        })
        
        let check = []

        for (let i = 0; i < updated_list.length; i++){
            check.push({
                id: updated_list[i].tag_id
            })
        }
        
        updated_list = []
        res = await tags.findAll({
            where: {
                [Op.or]: check
            }
        })
        for (let i = 0; i < res.length; i++){
            updated_list.push({
                id: res[i].id,
                name: res[i].name,
                sortOrder: res[i].sortOrder
            })
        }

        return callback({
            tags: updated_list
        })
    })
    
}
export const deleteUserTag = async (body, callback) => {
    await tags.findOne(
        { where: { id: body.id }}
    ).then(async result =>{
        if (!result){
            return callback({
                error: 'Тега с таким id не существует!'
            })
        }
        await usertags.destroy({
            where: {
                [Op.and]: [{user: body.user.uid}, {tag_id: body.id}]
            }
        })

        let updated_list = await usertags.findAll({
            attributes: ['tag_id'],
            where: {user: body.user.uid}
        })
        
        let check = []

        for (let i = 0; i < updated_list.length; i++){
            check.push({
                id: updated_list[i].tag_id
            })
        }

        updated_list = []

        let res = await tags.findAll({
            where: {
                [Op.or]: check
            }
        })
        for (let i = 0; i < res.length; i++){
            updated_list.push({
                id: res[i].id,
                name: res[i].name,
                sortOrder: res[i].sortOrder
            })
        }
        return callback({
            tags: updated_list
        })
    })
}
export const getUserTags = async (user, callback) => {
    await usertags.findAll(
        { where: { user: user.uid }}
    ).then(async result =>{
        if (!result){
            return callback({
                error: 'У вас нет тегов!'
            })
        }
        
        let check = []

        for (let i = 0; i < result.length; i++){
            check.push({
                id: result[i].tag_id
            })
        }

        let res = await tags.findAll({
            where: {
                [Op.or]: check
            }
        })
        
        let updated_list = []
        for (let i = 0; i < res.length; i++){
            updated_list.push({
                id: res[i].id,
                name: res[i].name,
                sortOrder: res[i].sortOrder
            })
        }
        return callback({
            tags: updated_list
        })
    })
}

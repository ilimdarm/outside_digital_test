import express from "express"
import bodyParser from "body-parser"
import {createTag, getTag, getTagsList, updateTag, deleteTag } from "../controllers/tagController.js"
import {checkTokenTime, checkTokenValid} from "../controllers/tokenController.js"

var jsonParser = bodyParser.json()

export const tagRouter = express.Router()

tagRouter.post("/tag", jsonParser, async (req, res) => {
    try {
        if (!req.headers.authorization){
            res.status(400).send("Токен не получен")
        }
        let token = req.headers.authorization.split(' ')[1]
        if (!checkTokenTime(token))
            res.status(400).send("Время действия токена истекло")
    
        let user = await checkTokenValid(token)
        if (!user)
            return res.status(400).send("Не валидный токен")
        
        let { name, sortOrder } = req.body

        if (!name || !sortOrder ) {
            res.status(400).send("Не хватает данных")
        }
        sortOrder = sortOrder?sortOrder:0

        return createTag({name, sortOrder, user}, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})

tagRouter.get("/tag/:id", async (req, res) => {
    try {
        if (!req.headers.authorization){
            res.status(400).send("Токен не получен")
        }
        let token = req.headers.authorization.split(' ')[1]
        if (!checkTokenTime(token))
            res.status(400).send("Время действия токена истекло")
    
        let user = await checkTokenValid(token)
        if (!user)
            return res.status(400).send("Не валидный токен")

        const id = req.params.id
        
        return getTag(id, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})

tagRouter.get("/tag", async (req, res) => {
    try {
        if (!req.headers.authorization){
            res.status(400).send("Токен не получен")
        }
        let token = req.headers.authorization.split(' ')[1]
        if (!checkTokenTime(token))
            res.status(400).send("Время действия токена истекло")
    
        let user = await checkTokenValid(token)
        if (!user)
            return res.status(400).send("Не валидный токен")

        const sortByOrder = req.query.sortByOrder == ''?'sortByOrder':null
        const sortByName = req.query.sortByName == ''?'sortByName':null
        const offset = req.query.offset
        const length = req.query.length

        return getTagsList({sortByOrder, sortByName, offset, length}, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})

tagRouter.put("/tag/:id", jsonParser, async (req, res) => {
    try {
        if (!req.headers.authorization){
            res.status(400).send("Токен не получен")
        }
        let token = req.headers.authorization.split(' ')[1]
        if (!checkTokenTime(token))
            res.status(400).send("Время действия токена истекло")
    
        let user = await checkTokenValid(token)
        if (!user)
            return res.status(400).send("Не валидный токен")

        const id = req.params.id

        const { name, sortOrder } = req.body

        if (!name || !sortOrder) {
            return res.status(400).send("Не хватает данных")
        }

        return updateTag({id, name, sortOrder, user}, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})

tagRouter.delete("/tag/:id", async (req, res) => {
    try {
        if (!req.headers.authorization)
            return res.status(400).send("Токен не получен")
        
        let token = req.headers.authorization.split(' ')[1]
        if (!checkTokenTime(token))
            return res.status(400).send("Время действия токена истекло")
        
        let user = await checkTokenValid(token)
        if (!user)
            return res.status(400).send("Не валидный токен")
        
        const id = req.params.id

        return deleteTag({id, user}, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})


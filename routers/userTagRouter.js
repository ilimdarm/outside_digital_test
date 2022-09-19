import express from "express"
import bodyParser from "body-parser"
import {addTag, deleteUserTag, getUserTags } from "../controllers/usertagController.js"
import {checkTokenTime, checkTokenValid} from "../controllers/tokenController.js"


var jsonParser = bodyParser.json()

export const usertagRouter = express.Router()

usertagRouter.post("/user/tag", jsonParser, async (req, res) => {
    try {
        if (!req.headers.authorization)
            return res.status(400).send("Токен не получен")
        
        let token = req.headers.authorization.split(' ')[1]
        if (!checkTokenTime(token))
            return res.status(400).send("Время действия токена истекло")
        
        let user = await checkTokenValid(token)
        if (!user)
            return res.status(400).send("Не валидный токен")
        
        const tags_list = req.body.tags

        return addTag({tags_list, user}, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})


usertagRouter.delete("/user/tag/:id", async (req, res) => {
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

        return deleteUserTag({id, user}, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})

usertagRouter.get("/user/tag/my", async (req, res) => {
    try {
        if (!req.headers.authorization)
            return res.status(400).send("Токен не получен")
        
        let token = req.headers.authorization.split(' ')[1]
        if (!checkTokenTime(token))
            return res.status(400).send("Время действия токена истекло")
        
        let user = await checkTokenValid(token)
        if (!user)
            return res.status(400).send("Не валидный токен")
        
        return getUserTags(user, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})


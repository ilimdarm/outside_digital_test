import express from "express"
import bodyParser from "body-parser"
import {createUser, authUser, logoutUser, getUser, putUser, deleteUser, updateToken} from "../controllers/userController.js"
import {checkTokenTime, checkTokenValid} from "../controllers/tokenController.js"
import {validatePass, validateEmail, validateNickname} from "../validator.js"

var jsonParser = bodyParser.json()

export const userRouter = express.Router()

userRouter.post("/signin", jsonParser, (req, res) => {
    try {
        const { email, password, nickname } = req.body

        if (!email || !password || !nickname) {
            res.status(400).send("Не хватает данных")
        }
        if (!validatePass(password)){
            res.status(400).send({
                error: 'Пароль должен соодержать как минимум одну цифру, одну заглавную и одну строчную буквы! Минимальная длинна 8 символов!'
            })
        }
        if (!validateEmail(email)){
            res.status(400).send({
                error: 'Некорректный email'
            })
        }
        if (!validateNickname(nickname)){
            res.status(400).send({
                error: 'Максимальная длина nickname 30 символов'
            })
        }

        return createUser({email, password, nickname}, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})
userRouter.post("/login", jsonParser, (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password ) {
            return res.status(400).send("Не хватает данных")
        }

        return authUser({email, password}, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})

userRouter.post("/logout", async (req, res) => {
    try {
        if (!req.headers.authorization){
            return res.status(400).send("Токен не получен")
        }
        
        let token = req.headers.authorization.split(' ')[1]

        let user = await checkTokenValid(token)
        if (!user)
            return res.status(400).send("Не валидный токен")
        
        return logoutUser(token, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})

userRouter.get("/user", async (req, res) => {
    try {
        if (!req.headers.authorization){
            return res.status(400).send("Токен не получен")
        }
        
        let token = req.headers.authorization.split(' ')[1]

        if (!checkTokenTime(token))
            return res.status(400).send("Время действия токена истекло")

        let user = await checkTokenValid(token)
        if (!user)
            return res.status(400).send("Не валидный токен")
        
        return getUser(user, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})

userRouter.put("/user", jsonParser, async (req, res) => {
    try {
        if (!req.headers.authorization)
            return res.status(400).send("Токен не получен")
        
        let token = req.headers.authorization.split(' ')[1]
        if (!checkTokenTime(token))
            return res.status(400).send("Время действия токена истекло")
        
        let user = await checkTokenValid(token)
        if (!user)
            return res.status(400).send("Не валидный токен")
        
        const { email, password, nickname } = req.body

        if (!email || !password || !nickname) {
            return res.status(400).send("Не хватает данных")
        }
        
        if (!validatePass(password)){
            res.status(400).send({
                error: 'Пароль должен соодержать как минимум одну цифру, одну заглавную и одну строчную буквы! Минимальная длинна 8 символов!'
            })
        }
        if (!validateEmail(email)){
            res.status(400).send({
                error: 'Некорректный email'
            })
        }
        if (!validateNickname(nickname)){
            res.status(400).send({
                error: 'Максимальная длина nickname 30 символов'
            })
        }

        return putUser({email, password, nickname}, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})

userRouter.delete("/user", async (req, res) => {
    try {
        if (!req.headers.authorization)
            return res.status(400).send("Токен не получен")
        
        let token = req.headers.authorization.split(' ')[1]
        if (!checkTokenTime(token))
            return res.status(400).send("Время действия токена истекло")
        
        let user = await checkTokenValid(token)
        if (!user)
            return res.status(400).send("Не валидный токен")

        return deleteUser(token, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})

userRouter.post("/token/update", async (req, res) => {
    try {
        if (!req.headers.authorization)
            return res.status(400).send("Токен не получен")
        
        let token = req.headers.authorization.split(' ')[1]
        if (!checkTokenTime(token))
            return res.status(400).send("Время действия токена истекло")
        
        let user = await checkTokenValid(token)
        if (!user)
            return res.status(400).send("Не валидный токен")

        return updateToken(user, (response) => {
            res.send(response)
        })
    }
    catch (err) {
        console.log(err)
    }
})

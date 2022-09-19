import express from "express"
import cors from "cors"
import {userRouter} from "./routers/userRouter.js"
import {tagRouter} from "./routers/tagRouter.js"
import {usertagRouter} from "./routers/userTagRouter.js"
// import fs from 'fs'
// import swaggerUi from 'swagger-ui-express'

// const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json'))

const app = express()
app.use(cors())

app.use("/", userRouter)
app.use("/", tagRouter)
app.use("/", usertagRouter)

// app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(process.env.PORT ? process.env.PORT : 8088)
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.route.js'

const app = express()

app.use(cors({
  origin:"*",
  credentials:true
}))

app.set('trust proxy', 1)
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({limit:"16kb"}))

app.use("/api/v1/auth" , authRouter)

export{app}
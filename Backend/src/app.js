import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors({
  origin:"*",
  credentials:true
}))

app.set('trust proxy', true)
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({limit:"16kb"})) 

export{app}
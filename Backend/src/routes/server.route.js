import {Router} from 'express'
import { createServer, deleteServer, getServer, getServers, testServer, updateServer } from '../controllers/server.controller.js'

const serverRouter = Router()

serverRouter.route("/server-credentials").get(getServers)
serverRouter.route("/server-credential/:id").get(getServer)
serverRouter.route("/server-credentials").post(createServer)
serverRouter.route("/server-credentials/:id").put(updateServer)
serverRouter.route("/server-credentials/:id").delete(deleteServer)
serverRouter.route("/server-credentials/test").post(testServer)

export default serverRouter
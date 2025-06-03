import {Router} from 'express'
import { createServer, deleteServer, getServers, testServer, updateServer } from '../controllers/server.controller'

const serverRouter = Router()

serverRouter.route("/server-credentials").get(getServers)
serverRouter.route("/server-credentials").post(createServer)
serverRouter.route("/server-credentials/:id").put(updateServer)
serverRouter.route("/server-credentials/:id").delete(deleteServer)
serverRouter.route("/server-credentials/:id/test").post(testServer)

export default serverRouter
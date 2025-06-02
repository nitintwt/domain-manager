import {Router} from 'express'

const serverRouter = Router()

serverRouter.route("/server-credentials").get()
serverRouter.route("/server-credentials").post()
serverRouter.route("/server-credentials/:id").put()
serverRouter.route("/server-credentials/:id").delete()
serverRouter.route("/server-credentials/:id/test").post()

export default serverRouter
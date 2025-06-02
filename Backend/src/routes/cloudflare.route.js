import {Router} from 'express'
import { addCloudflareAccount, deleteCloudflareAccount, getCloudflareAccount, testCloudflareCredentials, updateCloudflareAccount } from '../controllers/cloudflare.controller'

const cloudFlareRouter = Router()

cloudFlareRouter.route("/cloudflare-accounts").get(getCloudflareAccount)
cloudFlareRouter.route("/cloudflare-accounts").post(addCloudflareAccount)
cloudFlareRouter.route("/cloudflare-accounts/:id").put(updateCloudflareAccount)
cloudFlareRouter.route("/cloudflare-accounts/:id").delete(deleteCloudflareAccount)
cloudFlareRouter.route("/cloudflare-accounts/:id/test").post(testCloudflareCredentials)

export default cloudFlareRouter
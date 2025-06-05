import {Router} from 'express'
import { addCloudflareAccount, getCloudflareAccount,  deleteCloudflareAccount, getCloudflareAccounts, testCloudflareCredentials, updateCloudflareAccount } from '../controllers/cloudflare.controller.js'

const cloudFlareRouter = Router()

cloudFlareRouter.route("/cloudflare-accounts").get(getCloudflareAccounts)
cloudFlareRouter.route("/cloudflare-account/:id").get(getCloudflareAccount)
cloudFlareRouter.route("/cloudflare-accounts").post(addCloudflareAccount)
cloudFlareRouter.route("/cloudflare-accounts/:id").put(updateCloudflareAccount)
cloudFlareRouter.route("/cloudflare-accounts/:id").delete(deleteCloudflareAccount)
cloudFlareRouter.route("/cloudflare-accounts/test").post(testCloudflareCredentials)

export default cloudFlareRouter
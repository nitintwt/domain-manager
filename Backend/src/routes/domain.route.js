import { Router } from "express";
import {checkCloudflareValidity, checkServerValidity, createDomain, deleteDomain, getDomain, getDomains, updateDomain} from '../controllers/domain.controller.js'

const domainRouter = Router()

domainRouter.route("/domain-names").get(getDomains)
domainRouter.route("/domain-name/:id").get(getDomain)
domainRouter.route("/domain-name").post(createDomain)
domainRouter.route("/domain-name").put(updateDomain)
domainRouter.route("/domain-name/:id").delete(deleteDomain)
domainRouter.route("/cloudflare-validity").put(checkCloudflareValidity)
domainRouter.route("/server-validity").put(checkServerValidity)

export default domainRouter
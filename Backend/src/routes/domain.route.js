import { Router } from "express";
import {checkCloudflareValidity, checkServerValidity, createDomain, createDomainInCloudflare, createDomainInServer, deleteDomain, getDomain, getDomains} from '../controllers/domain.controller.js'

const domainRouter = Router()

domainRouter.route("/domain-names").get(getDomains)
domainRouter.route("/domain-name/:id").get(getDomain)
domainRouter.route("/domain-name").post(createDomain)
domainRouter.route("/domain-name/:id").delete(deleteDomain)
domainRouter.route("/cloudflare-validity").put(checkCloudflareValidity)
domainRouter.route("/server-validity").put(checkServerValidity)
domainRouter.route("/domain-name/create-domain-cloduflare").post(createDomainInCloudflare)
domainRouter.route("/domain-name/create-domain-server").post(createDomainInServer)

export default domainRouter
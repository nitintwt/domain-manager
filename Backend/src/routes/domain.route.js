import { Router } from "express";
import {checkCloudflareValidity, checkServerValidity, clearCacheOfDomain, createDomain, createDomainInCloudflare, createDomainInServer, deleteDomain, deleteDomainInCloudflare, getDomain, getDomains} from '../controllers/domain.controller.js'

const domainRouter = Router()

domainRouter.route("/domain-names").get(getDomains)
domainRouter.route("/domain-name/:id").get(getDomain)
domainRouter.route("/domain-name").post(createDomain)
domainRouter.route("/domain-name/:id").delete(deleteDomain)
domainRouter.route("/cloudflare-validity").put(checkCloudflareValidity)
domainRouter.route("/server-validity").put(checkServerValidity)
domainRouter.route("/domain-name/create-domain-cloduflare").post(createDomainInCloudflare)
domainRouter.route("/domain-name/create-domain-server").post(createDomainInServer)
domainRouter.route("/domain-name/clear-cache-cloudflare").post(clearCacheOfDomain)
domainRouter.route("/domain-name/delete-domain-cloudflare").delete(deleteDomainInCloudflare)

export default domainRouter
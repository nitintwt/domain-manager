import { Router } from "express";
import {createDomain, deleteDomain, getDomain, getDomains, updateDomain} from '../controllers/domain.controller.js'

const domainRouter = Router()

domainRouter.route("/").get(getDomains)
domainRouter.route("/").get(getDomain)
domainRouter.route("/").post(createDomain)
domainRouter.route("/").put(updateDomain)
domainRouter.route("/").delete(deleteDomain)

export default domainRouter
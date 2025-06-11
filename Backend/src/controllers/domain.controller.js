import { Domain } from "../models/domain.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {Cloudflare} from '../models/cloudflare.model.js'
import { decrypt } from "../utils/decrypt.js";
import axios from 'axios'
import {Server} from "../models/server.model.js"
import { Client } from "ssh2";

const getDomains = asyncHandler(async (req , res)=>{
  const {userId} = req.query
  try {
    const domains = await Domain.find({owner:userId})
    return res.status(200).json(
      new ApiResponse(200 , domains , "Domains fetched successfully")
    )
  } catch (error) {
    console.log("Something went wrong while fetching domains" , error)
    return res.status(500).json(
      new ApiResponse(500 , null , "Something went wrong while fetching domains")
    )
  }
})

const getDomain = asyncHandler(async (req , res)=>{
  const id= req.params.id
  try {
    const domain = await Domain.findById(id)
    return res.status(200).json(
      new ApiResponse(200 , domain , "Domain fetched successfully")
    )
  } catch (error) {
    console.log("Something went wrong while fetching domain" , error)
    return res.status(500).json(
      new ApiResponse(500 , null , "Something went wrong while fetching domain")
    )
  }
})

const createDomain = asyncHandler(async (req , res)=>{
  const {userId , domains , cloudflareAccountId , serverId}= req.body
  try {
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json(
        new ApiResponse(404 , null , "User not found")
      )
    }

    const response = await Promise.all(domains.map( async (domain)=>{
      await Domain.create({
      owner:userId,
      cloudflareAccountId:cloudflareAccountId,
      serverId:serverId,
      domainName:domain
      })
    }))

    return res.status(200).json(
      new ApiResponse(200 , response , "Domain created successfully")
    )
  } catch (error) {
    console.log("Something went wrong while creating domain" , error)
    return res.status(500).json(
      new ApiResponse(500 , null , "Something went wrong while creating domain")
    )
  }
})

const deleteDomain = asyncHandler( async ( req , res)=>{
  const id = req.params.id
  try {
    const domain = await Domain.findByIdAndDelete(id)
    return res.status(200).json(
      new ApiResponse(200 , null , "Domain deleted successfully")
    )
  } catch (error) {
    console.log("Something went wrong while deleting domain" , error)
    return res.status(500).json(
      new ApiResponse(500 , null , "Something went wrong while deleting domain")
    )
  }
})

const checkCloudflareValidity = asyncHandler ( async ( req , res)=>{
  const {domainId}= req.body
  try {
    const domain = await Domain.findById(domainId)
    const cloudflare = await Cloudflare.findById(domain.cloudflareAccountId)
    const token = decrypt( cloudflare.apiToken , cloudflare.tokenIV , cloudflare.tokenTag)
    const response = await axios.get(
      `https://api.cloudflare.com/client/v4/zones?name=${domain.domainName}`,
      {
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (response.data?.success && response.data.result.length >0) {
      domain.isCloudflareValid=true
      domain.lastValidityChecked= new Date()
      await domain.save()
      return res.status(200).json(
        new ApiResponse(200, { valid: true }, "DomainName is valid in Cloudflare")
      );
      
    } else {
      domain.isCloudflareValid=false
      domain.lastValidityChecked= new Date()
      await domain.save()
      return res.status(200).json(
        new ApiResponse(200, { valid: false }, "DomainName is invalid in Cloudflare")
      );
    }
  } catch (error) {
    console.log("Something went wrong while checking cloudflare validity for domain name", error)
    return res.status(500).json(
      new ApiResponse(500 , null , "Something went wrong while checking cloudflare validity for domain name")
    )
  }
})

const checkServerValidity = asyncHandler ( async ( req , res)=>{
  const {domainId} = req.body
  try {
    const domain = await Domain.findById(domainId)
    const server = await Server.findById(domain.serverId)
    const password = decrypt(server.sshPassword , server.tokenIV , server.tokenTag)
    
  const conn = new Client()

  conn
    .on("ready", () => {
      conn.exec(`echo "${password}" | sudo -S sh -c 'find /home/*/htdocs/ -type d -name "${domain.domainName}" -wholename "*/htdocs/${domain.domainName}"'`, (err, stream) => {
        if (err) {
          conn.end();
          return res.status(500).json({ message: "Domain name not found in the server" });
        }
        let output = "";
        stream
          .on("close", async () => {
            conn.end();

            const cleanedOutput = output.replace(/\[sudo\] password for nitin:\s*/, "").trim();

            if (!cleanedOutput || cleanedOutput.includes("No such file or directory")) {
              domain.isCloudpanelValid=false
              await domain.save()
              return res.status(200).json(
                new ApiResponse(200, { valid: false }, "DomainName not found in the server")
              )
            }
            domain.isCloudpanelValid=true
            await domain.save()
            return res.status(200).json(
              new ApiResponse(200, { valid: true }, "Domain name found in the server")
            );
          })
          .on("data", (data) => {
            output += data.toString();
          })
          .stderr.on("data", (data) => {
            output += data.toString();
          });
      });
    })
    .on("error", (err) => {
      return res.status(500).json({ message: "SSH connection failed", error: err.message });
    })
    .connect({
      host: server.hostName,
      port: server.sshPort,
      username: server.sshUsername,
      password:password
    });
  } catch (error) {
    console.log("Something went wrong while checking server validity for domain name")
    return res.status(500).json(
      new ApiResponse(500 , null , "Something went wrong while checking server validity for domain name")
    )
  }
})

export {getDomains , getDomain , createDomain, deleteDomain , checkCloudflareValidity , checkServerValidity}

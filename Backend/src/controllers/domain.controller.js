import { Domain } from "../models/domain.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {Cloudflare} from '../models/cloudflare.model.js'
import { decrypt } from "../utils/decrypt.js";
import axios from 'axios'
import {Server} from "../models/server.model.js"
import { Client } from "ssh2";
import crypto from 'crypto'
import getZoneId from "../utils/getZoneId.js";

const getDomains = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  try {
    const domains = await Domain.find({ owner: userId })
      .populate({
        path: "cloudflareAccount",
        select: "accountName"
      })
      .populate({
        path: "server",
        select: "serverName"
      });

    return res.status(200).json({
      success: true,
      data: domains,
      message: "Domains fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching domains:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch domains"
    });
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

    const response = await Promise.all(
      domains.map(async (domain) => {
        const domainData = {
          owner: userId,
          cloudflareAccount: cloudflareAccountId,
          domainName: domain,
        };
        
        if (serverId) {
          domainData.server = serverId;
        }

        return await Domain.create(domainData);
      })
    );

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
    const cloudflare = await Cloudflare.findById(domain.cloudflareAccount)
    const apiKey = decrypt( cloudflare.apiKey , cloudflare.tokenIV , cloudflare.tokenTag)
    const response = await axios.get(
      `https://api.cloudflare.com/client/v4/zones?name=${domain.domainName}`,
      {
        headers: {
          "X-Auth-Key": apiKey,
          "X-Auth-Email": cloudflare.email,
        },
      }
    )
    if (response.data?.success && response.data.result.length >0) {
      domain.cloudflareStatus="valid"
      domain.lastValidityChecked= new Date()
      await domain.save()
      return res.status(200).json(
        new ApiResponse(200, { valid: true }, "DomainName is valid in Cloudflare")
      );
      
    } else {
      domain.cloudflareStatus="invalid"
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
    const server = await Server.findById(domain.server)
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
              domain.serverStatus="invalid"              
              await domain.save()
              return res.status(200).json(
                new ApiResponse(200, { valid: false }, "DomainName not found in the server")
              )
            }
            domain.serverStatus="valid"
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
    console.log("Something went wrong while checking server validity for domain name", error)
    return res.status(500).json(
      new ApiResponse(500 , null , "Something went wrong while checking server validity for domain name")
    )
  }
})

const createDomainInCloudflare = asyncHandler(async (req, res) => {
  const { domainName, cloudflareAccount, owner } = req.body;

  try {
    const cloudflare = await Cloudflare.findById(cloudflareAccount);
    if (!cloudflare) {
      return res.status(404).json(
        new ApiResponse(404, null, "Cloudflare account not found")
      );
    }
    const apiKey = decrypt( cloudflare.apiKey , cloudflare.tokenIV , cloudflare.tokenTag)

    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/zones`,
      {
        name: domainName,
        jump_start: true,
      },
      {
        headers: {
          "X-Auth-Key": `${apiKey}`,
          "X-Auth-Email": `${cloudflare.email}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response", response)
    const newDomain = await Domain.create({
      owner,
      domainName,
      cloudflareAccount,
      cloudflareZoneId:response?.data?.result?.id
    })

    return res.status(200).json(
      new ApiResponse(200, newDomain, "Domain created successfully")
    );
  } catch (error) {
    console.log("Something went wrong while creating domain in your Cloudflare account", error);
    return res.status(500).json(
      new ApiResponse(500, null, "Something went wrong while creating domain in your Cloudflare account")
    );
  }
})

const createDomainInServer = asyncHandler(async (req, res) => {
  const { domainName, serverId , owner } = req.body;

  if (!domainName || !serverId) {
    return res.status(400).json(new ApiResponse(400, null, "domainName and serverId are required"));
  }

  const server = await Server.findById(serverId);
  if (!server) {
    return res.status(404).json(new ApiResponse(404, null, "Server not found"));
  }

  const password = decrypt(server.sshPassword, server.tokenIV, server.tokenTag);
  const randomUsername = `user_${crypto.randomBytes(4).toString("hex")}`;

  const ssh = new Client();
  let responseSent = false;

  ssh
    .on("ready", () => {
      const checkCommand = `echo "${password}" | sudo -S sh -c 'find /home -type d -name "${domainName}"'`;
      ssh.exec(checkCommand, (err, stream) => {
        if (err) {
          ssh.end();
          return res.status(500).json(new ApiResponse(500, null, "Failed to check if domain exists"));
        }

        let output = "";
        stream
          .on("close", () => {
            if (output.includes(domainName)) {
              ssh.end();
              return res.status(200).json(new ApiResponse(200, null, `Domain ${domainName} already exists`));
            }

            const createCommand = `echo "${password}" | sudo -S sh -c '
              useradd -m -d /home/${randomUsername} -s /bin/bash ${randomUsername} && \
              mkdir -p /home/${randomUsername}/htdocs/${domainName} && \
              chown -R ${randomUsername}:${randomUsername} /home/${randomUsername} && \
              cp -r /etc/skel /home/${randomUsername}/htdocs/${domainName} && \
              echo "<?php phpinfo(); ?>" > /home/${randomUsername}/htdocs/${domainName}/index.php
            '`;

            ssh.exec(createCommand, (createErr, createStream) => {
              if (createErr) {
                ssh.end();
                return res.status(500).json(new ApiResponse(500, null, "Failed to execute create command"));
              }

              let createOutput = "";
              createStream
                .on("close", async () => {
                  ssh.end();
                  if (!responseSent) {
                    responseSent = true;
                    let createdDomain = await Domain.findOne({domainName:domainName})
                    if (!createdDomain){
                      createdDomain = await Domain.create({
                      domainName:domainName,
                      server:serverId,
                      owner:owner
                    })
                    } else {
                      createdDomain.server = serverId
                      await createdDomain.save()
                    }
                    return res.status(201).json(new ApiResponse(201, createdDomain , `Domain ${domainName} created successfully with PHP project`));
                  }
                })
                .on("data", (data) => {
                  createOutput += data.toString();
                })
                .stderr.on("data", (data) => {
                  createOutput += data.toString();
                });
            });
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
      if (!responseSent) {
        responseSent = true;
        return res.status(500).json(new ApiResponse(500, null, `SSH connection error: ${err.message}`));
      }
    })
    .connect({
      host: server.hostName,
      port: server.sshPort,
      username: server.sshUsername,
      password: password,
    });
})

const deleteDomainInServer = asyncHandler(async (req, res) => {
  const id = req.params.id

  const domain = await Domain.findById(id)
  const server = await Server.findById(domain.server)
  const password = decrypt(server.sshPassword, server.tokenIV, server.tokenTag);
  const ssh = new Client();
  let responseSent = false;

  const execCommand = (ssh, command) => {
    return new Promise((resolve, reject) => {
      ssh.exec(command, (err, stream) => {
        if (err) return reject(err);
        let output = "";
        stream.on("data", (data) => (output += data.toString()));
        stream.stderr.on("data", (data) => (output += data.toString()));
        stream.on("close", () => resolve(output.trim()));
      });
    });
  };

  ssh
    .on("ready", async () => {
      try {
        // 1. Find the domain path
        const findCommand = `echo "${password}" | sudo -S find /home -type d -name "${domain.domainName}" -wholename "*/htdocs/${domain.domainName}"`;
        const foundPath = await execCommand(ssh, findCommand);

        if (!foundPath || foundPath.includes("No such file or directory")) {
          ssh.end();
          if (!responseSent) {
            responseSent = true;
            return res
              .status(404)
              .json(new ApiResponse(404, null, `Domain ${domain.domainName} not found on server`));
          }
        }

        // 2. Delete the domain folder
        const deleteCommand = `echo "${password}" | sudo -S rm -rf "${foundPath}"`;
        await execCommand(ssh, deleteCommand);
        ssh.end();

        if (!responseSent) {
          responseSent = true;
          return res
            .status(200)
            .json(new ApiResponse(200, null, `Domain ${domain.domainName} deleted successfully`));
        }
      } catch (err) {
        ssh.end();
        if (!responseSent) {
          responseSent = true;
          return res
            .status(500)
            .json(new ApiResponse(500, null, `Error while deleting domain: ${err.message}`));
        }
      }
    })
    .on("error", (err) => {
      if (!responseSent) {
        responseSent = true;
        return res
          .status(500)
          .json(new ApiResponse(500, null, `SSH connection failed: ${err.message}`));
      }
    })
    .connect({
      host: server.hostName,
      port: server.sshPort,
      username: server.sshUsername,
      password: password,
    });
});

const clearCacheOfDomain = asyncHandler ( async ( req , res)=>{
  const {domainId}= req.body
  try {
    const domain = await Domain.findById(domainId)
    const cloudflare = await Cloudflare.findById(domain.cloudflareAccount)
    const apiKey = decrypt( cloudflare.apiKey , cloudflare.tokenIV , cloudflare.tokenTag)

    const zoneId = await getZoneId(domain.domainName, apiKey , cloudflare.email)
      console.log("Zone ID:", zoneId);
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
      {
        purge_everything: true,
      },
      {
        headers: {
          "X-Auth-Key": apiKey,
          "X-Auth-Email": cloudflare.email,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data?.success) {
      return res.status(200).json(
        new ApiResponse(200, null, "Cache cleared successfully")
      );
    } else {
      return res.status(500).json(
        new ApiResponse(500, null, "Failed to clear cache in Cloudflare")
      );
    }

  } catch (error) {
    console.error("Error clearing cache in domain:", error);
    return res.status(500).json(
      new ApiResponse(500, null, "Something went wrong while clearing cache in domain")
    );
  }
})

const deleteDomainInCloudflare = asyncHandler ( async (req , res)=>{
  const id=req.params.id
 
  try {
    const domain = await Domain.findById(id)
    const cloudflare = await Cloudflare.findById(domain.cloudflareAccount)
    const apiKey = decrypt( cloudflare.apiKey , cloudflare.tokenIV , cloudflare.tokenTag)
    const zoneId = await getZoneId(domain.domainName, apiKey , cloudflare.email)
    
    const response = await axios.delete(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}`,
      {
        headers: {
          "X-Auth-Key": apiKey,
          "X-Auth-Email": cloudflare.email,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("deletd", response)
    if (response.data?.success) {
      return res.status(200).json(
        new ApiResponse(200, null, "Domain deleted successfully in Cloudflare")
      );
    } else {
      console.error("Cloudflare API Error:", response.data.errors);
      return res.status(500).json(
        new ApiResponse(500, null, "Failed to delete domain in Cloudflare")
      );
    }
  } catch (error) {
    console.error("Error deleting domain in cloudflare:", error);
    return res.status(500).json(
      new ApiResponse(500, null, "Something went wrong while deleting domain in cloudflare")
    );
  }
})

export {getDomains , getDomain , createDomain, deleteDomain , checkCloudflareValidity , checkServerValidity , createDomainInCloudflare , createDomainInServer , clearCacheOfDomain , deleteDomainInCloudflare , deleteDomainInServer}

import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {Server} from "../models/server.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { Client } from "ssh2";

const getServers = asyncHandler(async (req , res)=>{
  const {userId} = req.query
  try {
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({message:"No user found with the provided user id."})
    }

    const servers = await Server.find({owner:userId})
    return res.status(200).json(
      new ApiResponse(200 , servers , "All Server fetched successfully.")
    )
  } catch (error) {
    console.error("Something went wrong while fetching servers" , error)
    return res.status(500).json(
      {message: "Something went wrong while fetching servers"}
    ) 
  }
})

const getServer = asyncHandler(async (req , res)=>{
  const id = req.params.id
  try {
    const server = await Server.findById(id)
    return res.status(200).json(
      new ApiResponse(200 , server , "Server fetched successfully.")
    )
  } catch (error) {
    console.error("Something went wrong while fetching server" , error)
    return res.status(500).json(
      {message: "Something went wrong while fetching server"}
    ) 
  }
})

const createServer = asyncHandler( async (req , res)=>{
  const {userId , serverName , hostName , sshPort , serverLocation , sshUsername , sshKey , sshPassword} = req.body
  try {
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({message:"No user found with the provided user id."})
    }

    const serverData = {
      serverName,
      hostName,
      sshPort: sshPort || 22,
      serverLocation,
      sshUsername,
      owner: userId
    };

    if (sshKey) {
      serverData.sshKey = sshKey;
    } else {
      serverData.sshPassword = sshPassword;
    }

    const server = await Server.create(serverData);
    return res.status(200).json(
      new ApiResponse(200 , server , "Server created successfully.")
    )
  } catch (error) {
    console.error("Something went wrong while creating server" , error)
    return res.status(500).json(
      {message: "Something went wrong while creating server"}
    ) 
  }
})

const updateServer = asyncHandler ( async ( req , res)=>{
  const {userId , serverName , hostName , sshPort , serverLocation , sshUsername , sshKey , sshPassword} = req.body
  const id = req.params.id
  try {
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({message:"No user found with the provided user id."})
    }

    const updateData = {}
    if(serverName) updateData.serverName=serverName
    if(hostName) updateData.hostName=hostName
    if(sshPort) updateData.sshPort=sshPort
    if(serverLocation) updateData.serverLocation=serverLocation
    if(sshUsername) updateData.sshUsername=sshUsername
    if(sshKey) updateData.sshKey=sshKey
    if(sshPassword) updateData.sshPassword=sshPassword

    const server = await Server.findByIdAndUpdate(id , updateData , {new:true})
    return res.status(200).json(
      new ApiResponse(200 , server , "Server update Successfull.")
    )
  } catch (error) {
    console.error("Something went wrong while updating server" , error)
    return res.status(500).json(
      {message: "Something went wrong while updating server"}
    ) 
  }
})

const deleteServer = asyncHandler( async ( req , res)=>{
  const id = req.params.id
  try {
    const server = await Server.findByIdAndDelete(id)
    return res.status(200).json(
      new ApiResponse(200 , null , "Server Deleted Successfully")
    )
  } catch (error) {
    console.error("Something went wrong while deleting server" , error)
    return res.status(500).json(
      {message: "Something went wrong while deleting server"}
    ) 
  }

})

const testServer = asyncHandler(async (req, res) => {
  const { hostName, sshPort = 22, sshUsername, sshKey, sshPassword } = req.body;

  if (!hostName || !sshUsername || (!sshKey && !sshPassword)) {
    return res.status(400).json({
      message: "Missing required SSH credentials.",
    });
  }

  const conn = new Client();

  conn
    .on("ready", () => {
      conn.exec('echo "connected"', (err, stream) => {
        if (err) {
          conn.end();
          return res.status(500).json({ message: "SSH command execution failed." });
        }

        let output = "";
        stream
          .on("close", () => {
            conn.end();
            return res.status(200).json(
              new ApiResponse(200, { output: output.trim() }, "SSH connection successful.")
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
      host: hostName,
      port: sshPort,
      username: sshUsername,
      ...(sshKey
        ? { privateKey: sshKey }
        : { password: sshPassword }),
    });
});


export {getServers , createServer , updateServer , deleteServer , testServer , getServer}
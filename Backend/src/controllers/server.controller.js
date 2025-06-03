import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import {Server} from "../models/server.model"
import { ApiResponse } from "../utils/ApiResponse";
import { Client } from "ssh2";

const getServers = asyncHandler(async (req , res)=>{
  const {userId} = req.body
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

const createServer = asyncHandler( async (req , res)=>{
  const {userId , serverName , hostName , sshPort , serverLocation , sshUsername , sshKey , sshPassword} = req.body
  try {
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({message:"No user found with the provided user id."})
    }

    const server = await Server.create({
      serverName,
      hostName,
      sshPort,
      serverLocation,
      sshUsername,
      sshKey,
      sshPassword,
      owner:userId
    })
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
  const {userId} = req.body
  const id = req.params.id
  try {
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({message:"No user found with the provided user id."})
    }

    const server = await Server.findByIdAndDelete(id)
    return res.status(200).json(
      new ApiResponse(200 , server , "Server Deleted Successfully")
    )
  } catch (error) {
    console.error("Something went wrong while deleting server" , error)
    return res.status(500).json(
      {message: "Something went wrong while deleting server"}
    ) 
  }

})

//todo:- write the logic to test the server using ssh
const testServer = asyncHandler( async ( req , res)=>{
  const {userId} = req.body
  const id = req.params.id
  try {
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({message:"No user found with the provided user id."})
    }

    const server = await Server.findById(id)
    return res.status(200).json(
      new ApiResponse(200 , server , "Server test successfull")
    )
  } catch (error) {
    console.error("Something went wrong while testing server" , error)
    return res.status(500).json(
      {message: "Something went wrong while testing server"}
    ) 
  }
})

export {getServers , createServer , updateServer , deleteServer , testServer}
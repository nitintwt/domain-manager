import { Domain } from "../models/domain.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

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
  const {userId}= req.body
  try {
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json(
        new ApiResponse(404 , null , "User not found")
      )
    }

    const domain = await Domain.create({
      owner:userId
    })

    return res.status(200).json(
      new ApiResponse(200 , domain , "Domain created successfully")
    )
  } catch (error) {
    console.log("Something went wrong while creating domain" , error)
    return res.status(500).json(
      new ApiResponse(500 , null , "Something went wrong while creating domain")
    )
  }
})

const updateDomain = asyncHandler( async (req , res)=>{
  const {userId , id} = req.body
  try {
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json(
        new ApiResponse(404 , null , "User not found")
      )
    }

    const updatedDomain = await Domain.findByIdAndUpdate(id, {

    })
    return res.status(200).json(
      new ApiResponse(200 , updateDomain , "Domain updated successfully")
    )
  } catch (error) {
    console.log("Something went wrong while updating domain" , error)
    return res.status(500).json(
      new ApiResponse(500 , null , "Something went wrong while updating domain")
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

export {getDomains , getDomain , createDomain , updateDomain , deleteDomain}

import { Cloudflare } from "../models/cloudflare.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from "axios";
import { decrypt } from "../utils/decrypt.js";

const getCloudflareAccounts = asyncHandler( async (req , res)=>{
  const {userId} = req.query
  
  try {
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({message:"No user found with the provided user id."})
    }

    const accounts = await Cloudflare.find({owner:userId})
    return res.status(200).json(
      new ApiResponse(200 , accounts , "All cloudflare accounts fetched successfully.")
    )
  } catch (error) {
    console.error("Something went wrong while fetching cloudflare accounts" , error)
    return res.status(500).json(
      {message: "Something went wrong while fetching cloudflare accounts"}
    ) 
  }
})

const getCloudflareAccount = asyncHandler( async (req , res)=>{
  const id = req.params.id
  
  try {
    const account = await Cloudflare.findById(id)
    return res.status(200).json(
      new ApiResponse(200 , account , "Cloudflare accounts fetched successfully.")
    )
  } catch (error) {
    console.error("Something went wrong while fetching cloudflare account" , error)
    return res.status(500).json(
      {message: "Something went wrong while fetching cloudflare account"}
    ) 
  }
})

const addCloudflareAccount = asyncHandler (async (req , res)=>{
  const {userId , accountName, email , accountType , apiKey , zoneId } = req.body
  try {
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({message:"No user found with the provided user id."})
    }

    const cloudflareAccount = await Cloudflare.create({
      owner:userId,
      email:email,
      accountName:accountName,
      accountType:accountType,
      apiKey:apiKey,
      zoneId:zoneId
    })

    if(!cloudflareAccount._id){
      return res.status(500).json(
        new ApiResponse(500 ,null , "Something went wrong while adding your cloudflare account.")
      )
    }

    return res.status(200).json(new ApiResponse(
      200 , cloudflareAccount , "Cloudflare account added successfully"
    ))
  } catch (error) {
    console.error("Something went wrong while adding cloudflare accounts" , error)
    return res.status(500).json(
      {message: "Something went wrong while adding cloudflare accounts"}
    ) 
  }
})

const updateCloudflareAccount = asyncHandler ( async ( req , res)=>{
  const { accountName, email, apiKey, zoneId, accountType , userId } = req.body;
  const cloudflareId = req.params.id
  try {
    const user = await User.findById(userId)
    if (!user){
      return res.status(404).json(
        {message: "User doesn't exist" }
      )
    }
    const updateData = {};
    if (accountName) updateData.accountName = accountName;
    if (email) updateData.email = email;
    if (apiKey) updateData.apiKey = apiKey;
    if (zoneId) updateData.zoneId = zoneId;
    if (accountType) updateData.accountType = accountType;

    const updatedAccount = await Cloudflare.findByIdAndUpdate(
      cloudflareId,
      updateData,
      { new: true }
    );

    return res.status(200).json(
      new ApiResponse( 200 , updatedAccount , "Account updated successfully.")
    )
  } catch (error) {
    console.error("Something went wrong while updating the cloudflare account" , error)
    return res.status(500).json(
      {message: "Something went wrong while updating the cloudflare account"}
    )
  }
})

const deleteCloudflareAccount = asyncHandler(async (req , res)=>{
  const cloudflareId = req.params.id
  try {
    const account = await Cloudflare.findByIdAndDelete(cloudflareId)
    return res.status(200).json(
      new ApiResponse( 200 , null , "Account deleted successfully.")
    )
  } catch (error) {
    console.error("Something went wrong while deleting the cloudflare account" , error)
    return res.status(500).json(
      {message: "Something went wrong while deleting the cloudflare account"}
    )
  }

})

const testCloudflareCredentials = asyncHandler(async (req, res) => {
  const { apiKey , email } = req.body;

  if (!apiKey || !email) {
    return res.status(400).json(
      new ApiResponse(400, null, "API Key is required")
    );
  }

  try {
    const response = await axios.get(
      "https://api.cloudflare.com/client/v4/user",
      {
        headers: {
          "X-Auth-Key": apiKey,
          "X-Auth-Email": email,
        },
      }
    );

    if (response.data?.success) {
      return res.status(200).json(
        new ApiResponse(200, { valid: true }, "Cloudflare credentials are valid")
      );
    } else {
      return res.status(401).json(
        new ApiResponse(401, { valid: false }, "Invalid Cloudflare token")
      );
    }
  } catch (error) {
    console.error("Cloudflare API Error:", error);
    return res.status(401).json(
      new ApiResponse(401, { valid: false }, "Failed to verify Cloudflare token")
    );
  }
})

export {getCloudflareAccounts , addCloudflareAccount , updateCloudflareAccount , deleteCloudflareAccount , testCloudflareCredentials , getCloudflareAccount}
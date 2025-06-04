import { Cloudflare } from "../models/cloudflare.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { decrypt } from "../utils/decrypt.js"; 
import axios from "axios";

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
      new ApiResponse(200 , account , "All cloudflare accounts fetched successfully.")
    )
  } catch (error) {
    console.error("Something went wrong while fetching cloudflare accounts" , error)
    return res.status(500).json(
      {message: "Something went wrong while fetching cloudflare accounts"}
    ) 
  }
})

const addCloudflareAccount = asyncHandler (async (req , res)=>{
  const {userId , accountName, email , accountType , apiToken , zoneId } = req.body
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
      apiToken:apiToken,
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
  const { accountName, email, apiToken, zoneId, accountType , userId } = req.body;
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
    if (apiToken) updateData.apiToken = apiToken;
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

const testCloudflareCredentials = asyncHandler( async (req , res)=>{
  const {userId} = req.body
  const id = req.params.id
  try {
    const user = await User.findById(userId)
    if (!user){
      return res.status(404).json(
        {message: "User doesn't exist" }
      )
    }
    const cloudflareAccount = await Cloudflare.findById(id)
    if (!cloudflareAccount) {
      return res.status(404).json({ message: "Cloudflare account not found" });
    }

    const decryptedToken = decrypt(
      cloudflareAccount.apiToken,
      cloudflareAccount.tokenIV,
      cloudflareAccount.tokenTag
    );

    const response = await axios.get(
      "https://api.cloudflare.com/client/v4/user/tokens/verify",
      {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data && response.data.success) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Cloudflare credentials are valid."));
    } else {
      return res.status(401).json({ message: "Invalid Cloudflare token." });
    }
  } catch (error) {
    console.error("Something went wrong while testing your cloudflare account" , error)
    return res.status(500).json(
      {message: "Something went wrong while testing your cloudflare account"}
    )
  }
})

export {getCloudflareAccounts , addCloudflareAccount , updateCloudflareAccount , deleteCloudflareAccount , testCloudflareCredentials , getCloudflareAccount}
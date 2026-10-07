import { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    // 1. get content from req.body
    // 2. validate: if content is empty or only spaces -> ApiError 400
    // 3. create the tweet in DB, with owner = req.user._id
    // 4. send response with status 201

    const {content} = req.body // if didnt get anything means not valid user or other scenarios

    // const tweet = content.

    if(!content.trim()){ // validation of tweet
        throw new ApiError(400 , "Invalid Tweet!")
    }

    const tweet = await Tweet.create({
        content,
        owner : req.user._id
    })
    

    return res
    .status(201)
    .json(
        new ApiResponse(200 , {} , "Tweet creted and stored Successfully!")
    )

    
})

const getUserTweets = asyncHandler(async (req, res) => {
    // 1. get userId from req.params
    // 2. validate: isValidObjectId(userId), else ApiError 400
    // 3. find all tweets where owner is userId, newest first
    // 4. send response with status 200
})

const updateTweet = asyncHandler(async (req, res) => {
    // we do this later
})

const deleteTweet = asyncHandler(async (req, res) => {
    // we do this later
})

export { createTweet, getUserTweets, updateTweet, deleteTweet }
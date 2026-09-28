
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshToken = refreshToken
        await user.save({
            validateBeforeSave: false // saying dont run validation as there will be some filed with required etc. so here we dont require validation so use this 
        })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something Went Wrong While Generating Refresh And Access Token")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, username, password } = req.body;

    // Step 1: Validate fields
    //step 2 user register : validation

    // we are using this instead of multiple if conditions(better way thats it nothing else you also can use multiple if)
    if (
        [fullName, email, username, password].some((field) => {
            return !field || field.trim() === "";
        })
    ) {
        throw new ApiError(400, "All Fields Are Required!!");
    }

    // Step 2: Check whether user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }] // it will give first matching username or email person.so if we alredy have that user throw error that that user already exists
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "User with email or username already exists!!"
        );
    }

    //multer will give this files access. CHEKCKING IMAGES , AVATAR ,ALL FILES AND ALL 
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required!!");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed!!");
    }

    let coverImage;

    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar files are required!!")
    }


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // as we didnt check coverImage so we have to check this (so we use || "")
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    // console.log(isUser);


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully!!")
    )

    // Temporary response(always last after all validation)
    // return res.status(200).json({
    //     message: "ok"
    // });
});


const loginUser = asyncHandler(async (req, res) => {
    // req body => data
    // username or email for login
    //find the user
    //passwored check
    //access token and refresh token
    //send cookie

    const { email, username, password } = req.body

    if (!email || !username) {
        throw new ApiError(400, "Username or Password is required!");
    }

    User.findOne(
        {
            $or: [{ username }, { email }]
        }
    )

    if (!user) {
        throw new ApiError(404, "User is not registered!")
    }

    const isPasswordValid = await User.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials !")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    // now send this data in cookies (accessToken , refreshToken)

    const loggedInUser = await User.findById(user._id).
        select("-password -refreshToken")


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged In Successfully!"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined

            }
        },
        {
            new : true
        }
    ) 

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200 , {} , "User Logged Out!"))
})


export {
    registerUser, loginUser, logoutUser
};
import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createProduct = asyncHandler(async(req , res) => {


    //1 get data
    const { name , price , description } = req.body;

    // 2 . Validate

    if(!name || !price || !description){
        throw new ApiError(400 , "All fields are required!")
    }

    //3 . Handle image
    //upload images on cloudinary

    // 4. Save Product

    const product = await Product.create({
        name,
        price,
        description

    })

    // 5. Send response

    return res.status(200).json(
        new ApiResponse(
            201 , 
            product,
            "Product created successfully"
        )
    )

})

export { createProduct };
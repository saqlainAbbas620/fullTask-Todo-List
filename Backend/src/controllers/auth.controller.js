import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const signUp = asyncHandler(async(req, res)=>{
    const {fullname, email, password} = req.body

    const existedUser = await User.findOne({email})
    if(existedUser){
        return res.status(400).json("User already existed")
    }
    const user = await User.create({
        fullname,
        email,
        password
    })
    const createdUser = await User.findById(user._id).select("-password")
    if(!createdUser){
        return res.status(400).json("Something wrong with server")
    }

    res.status(200).json({data:createdUser, message:"User created successfully"})
})

const signIn = asyncHandler(async (req, res)=>{
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!user){
        return res.status(401).json("User not found")
    }
    const correctPassword = await user.checkPassword(password)
    if(!correctPassword){
        return res.status(401).json("Invalid Credentials")
    }
    const loginUser = await User.findById(user._id).select("-password")

    res.status(200).json({data:loginUser, message:"User successfully Login"})
})


export {
    signIn,
    signUp
}
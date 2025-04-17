import {User} from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req,res) =>{
     try{
        const {fullName,email,password} = req.body;

        if(!fullName || !email || !password ){
            return res.status(400).json({
                message:"All fields are required",
                success:false,
            });
        }

        const user = await User.findOne({email}); 
        
        
        if(user){ 
            return res.status(400).json({
                message:"Email id already exists",
                success:false,
            })
        }

        const hashedPassword = await bcrypt.hash(password,10); 
     
        const newUser = await User.create({
            fullName,
            email,
            password:hashedPassword,
        })

            return res.status(201).json({
                message:`Account created successfully.`,
                newUser,
                success:true,
            })
         }
     catch(err){
        console.log(err.message);
     }
}


export const login = async (req,res) =>{
    try{

        const {email,password} = req.body;

        if(!email || !password ){
            return res.status(400).json({
                message:"All fields are required",
                success:false,
            });
        }

        let user = await User.findOne({email}); 
        
        if(!user){ 
            return res.status(400).json({
                message:"Invalid credentials",
                success:false,
            })
        }

        const isMatch = await bcrypt.compare(password,user.password); 

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid credentials",
                success:false,
            })
        }

        
        const tokenData = { 
            id:user._id
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY,{expiresIn:'1D'}); //& generating the token

        //& setting the token in the cookie
        //& sending the token in the response
        //& setting the cookie in the response
        
        user = {
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
        }

        return res.status(200).cookie("token",token,{maxAge:24*60*60*1000,httpOnly:true,sameSite:"strict"}).json({
            message :`Welcome back ${user.fullName}`,
            user,
            success:true
        })

    }
     catch(err){
        console.log(err.message);
                 
     }
}


export const logout = async(req,res) =>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged Out Successfully",
            success:true
        })
    }catch(err){
        console.log(err.message);
    }
}


export const updateProfile = async(req,res) =>{
    try{
        const {fullName, email} = req.body;


        if(!fullName || !email){
            return res.status(400).json({
                message:"All fields are required",
                success:false,
            });
        }


        const userId = req.id; 
        let user = await User.findById(userId); 

        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:false,
            })
        }

        user.fullName = fullName;   
        user.email = email;
  

        await user.save(); 

        user = {
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
        }

        return res.status(200).json({
            message:"Profile updated successfully",
            user,
            success:true
        })

    }catch(err){
        console.log(err.message);
    }
}
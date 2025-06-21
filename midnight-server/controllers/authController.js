import bcrypt, { hash } from "bcryptjs"
import { userModel } from "../models/User.js"
import jwt from 'jsonwebtoken'


export const register = async(req, res) => {

    try {
        const { username, password, fname, lname } = req.body;
        const existing = await userModel.findOne({ username });

        if(existing){
            return res.status(400).json({ message: "User Already Exists" });
        }

        const hashed = await bcrypt.hash(password, 10)
        await userModel.create({ username, password: hashed, fname, lname});
        console.log("New User Created: ", username)
        return res.status(200).json({username, message: "User Created Successfully"})

    } catch (error) {
        console.error("Error during registration: ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }

    
}

export const login = async(req, res) => {
    try {
        const {username, password} = req.body;
        const user = await userModel.findOne({ username });

        if(!user) return res.status(400).json({ message: "Invalid Credentials." });
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) return res.status(400).json({ message: "Invalid Credentials" })
        const token = jwt.sign({ username: user.username }, process.env.SECRET || "tHisIsAseCrEtKeY")

        return res.status(200).json({message: "Logged In successfully", token})
    } catch (error) {
        console.log("Error logging in: ", error)
        return res.status(500).json({ message: "Something went wrong" });
    }
    
}
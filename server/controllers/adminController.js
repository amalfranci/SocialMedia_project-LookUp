import dotenv from "dotenv";

import { generateAdminToken } from "../utils/index.js";
import Users from "../models/userModel.js";

dotenv.config();

const adminLogin = (req, res) => {
    try {
        const { username, password } = req.body;

        if (username === process.env.adminUserName && password === process.env.adminPassword) {
            const token = generateAdminToken(username);
         
            res.status(201).json({ message: "login successful", success: true, adminUserName: username, token: token });
               console.log(req.body)
        } else {
            res.status(400).json({ error: "invalid username or password" });
        }
    } catch (error) {
        console.log(error);
    }
};

const getUsers = async (req, res) => {
  
    try {
        const users = await Users.find()

      
        res.status(200).json({users})

        
    }
    catch (err)
    {
        console.error(err.message)
    }
}


// block user

const blockUser = async (req, res) => {
    const { userId } = req.params;
    const { action } = req.body;

    try {
        const user = await Users.findById(userId);

        console.log("from bloch")

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (action === "block") {
            user.status = "blocked";
        } else if (action === "unblock") {
            user.status = "unblocked";
        }

        await user.save();

        res.status(200).json({ message: `User ${action}ed successfully`, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};



export { adminLogin,getUsers,blockUser };

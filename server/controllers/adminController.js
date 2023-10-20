import dotenv from "dotenv";

import { generateAdminToken } from "../utils/index.js";

dotenv.config();

const adminLogin = (req, res) => {
    try {
        const { username, password } = req.body;

        if (username === process.env.adminUserName && password === process.env.adminPassword) {
            const token = generateAdminToken(username);
            res.status(201).json({ message: "login successful", success: true, adminUserName: username, token });
        } else {
            res.status(400).json({ error: "invalid username or password" });
        }
    } catch (error) {
        console.log(error);
    }
};

export { adminLogin };

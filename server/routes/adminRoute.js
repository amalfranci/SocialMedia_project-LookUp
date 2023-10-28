import express from "express"
import { getUsers,blockUser} from "../controllers/adminController.js"
const router = express.Router()

router.get("/userslist", getUsers)

router.post('/users/:userId/block', blockUser);


export default router

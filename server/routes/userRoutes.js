
import express from "express"
import path from "path"
import { changePassword, getUser, requestPasswordReset, resetPassword, updateUser, verifyEmail } from "../controllers/userController.js"
import userAuth from "../middleware/authMiddleware.js"



const router = express.Router()
const __dirname = path.resolve(path.dirname(""))

router.get("/verify/:userId/:token", verifyEmail)

//RESET PASSWORD 

router.get("/reset-password/:userId/:token", resetPassword)
router.post("/request-passwordreset", requestPasswordReset)
router.post("/reset-password", changePassword)

router.post("/get-user/:id?", userAuth, getUser)
router.put("/update-user",userAuth,updateUser)

router.get("/verified", (req, res) => {
    res.sendFile(path.join(__dirname,"./views/build","index.html"))
})
router.get("/resetpassword", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});
export default router
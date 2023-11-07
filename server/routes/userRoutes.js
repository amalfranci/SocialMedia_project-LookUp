import express from "express";
import path from "path";
import {
  acceptRequest,
  changePassword,
  deleteFriendRequest,
  friendRequest,
  getFriendRequest,
  getUser,
  mutualFriends,
  requestPasswordReset,
  resetPassword,
  suggestedFriends,
  updateUser,
  usersuggestions,
  verifyEmail,
} from "../controllers/userController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();
const __dirname = path.resolve(path.dirname(""));

router.get("/verify/:userId/:token", verifyEmail);

//RESET PASSWORD

router.get("/reset-password/:userId/:token", resetPassword);
router.post("/request-passwordreset", requestPasswordReset);
router.post("/reset-password", changePassword);

//userprofie/update
router.post("/get-user/:id?", userAuth, getUser);
router.put("/update-user", userAuth, updateUser);

// suggested friends
router.post("/suggested-friends", userAuth, suggestedFriends);

// friend request
router.post("/friend-request", userAuth, friendRequest);
router.post("/get-friend-request", userAuth, getFriendRequest);

// accept / deny friend request
router.post("/accept-request", userAuth, acceptRequest);
router.get("/user-suggestions", usersuggestions);

// delete friend request
router.post("/delete-friend-request", userAuth, deleteFriendRequest)

// mutal friend

router.get('/mutual-friends/:user1Id/:user2Id',userAuth,mutualFriends)

router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});
router.get("/resetpassword", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});
export default router;

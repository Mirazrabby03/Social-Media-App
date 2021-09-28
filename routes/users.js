const express = require("express");
const { followUser, unfollowUser, getUser, getFriends } = require("../controller/userController");
const router = express.Router();

router.get("/", getUser)
router.get("/friends/:userId", getFriends)
router.put("/:id/follow", followUser)
router.put("/:id/unfollow", unfollowUser)


module.exports= router;  
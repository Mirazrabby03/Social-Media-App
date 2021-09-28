const User = require("../model/User")

const getUser= async(req,res) =>{
    const userId = req.query.userId;
    const username = req.query.username;
    try{
        const user = userId ? await User.findById(userId) :
        await User.findOne({username: username});
        const{password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    }catch(err){
        res.status(500).json(err);

    }
}

const  getFriends = async(req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.following.map(friendId =>{
                return User.findById(friendId)
            })
        )
            let friendList = [];
            friends.map(friend =>{
                const{_id, username,profilePicture} = friend;
                friendList.push({_id, username,profilePicture})
            });
            res.status(200).json(friendList)
    }catch(err){
        res.status(500).json(err)
    }
}

const followUser = async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push:{followers: req.body.userId}});
                await currentUser.updateOne({$push: {following: req.params.id}});
                res.status(200).json("User has been followed")
            }else{
                res.status(403).json("You have already followed the user")
            }
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(400).json("You cannot follow yourself")

    }
} 

const unfollowUser = async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull:{followers: req.body.userId}});
                await currentUser.updateOne({$pull: {following: req.params.id}});
                res.status(200).json("User has been unfollowed")
            }else{
                res.status(403).json("You do not follow this user")
            }
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(400).json("You cannot unfollow yourself")

    }
} 
module.exports={getUser, getFriends,followUser, unfollowUser}
const Post = require("../model/Post");
const User = require("../model/User");

const addPost = async(req,res)=>{
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);

    }catch(err){
        res.status(500).json(err);
    }

}

const updatePost = async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({
                $set: req.body
            });
            res.status(200).json("Your post has been updated")
        }else{
            res.status(400).json("You can only update your post")
        } 
    }catch(err){
        res.status(500).json(err);
    }
    
}

const deletePost = async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne({
                $set: req.body
            });
            res.status(200).json("Your post has been deleted")
        }else{
            res.status(400).json("You can only delete your post")
        } 
    }catch(err){
        res.status(500).json(err);
    }
    
}
const likePost = async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
    if(!post.likes.includes(req.body.userId)){
        await post.updateOne({
            $push :{ likes: req.body.userId}
        });
        res.status(200).json("The post has been liked")
    }else{
        await post.updateOne({ 
            $pull:{ likes: req.body.userId}
        });
        res.status(200).json("The post has been disliked")
    }
    }catch(err){
        res.status(500).json(err);
    }
    
}
const commentPost = async(req,res)=>{
    try{
        const comment = {text: req.body.text}
        const post = await Post.findById(req.params.id)
       
            await post.updateOne({
                
                $push:{comments: req.body.userId, comment}
            });
            res.status(200).json("Comment Successfully done");  
        
    }catch(err){
        res.status(500).json(err);
    }
}
const getPost = async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post);

    }catch(err){
        res.status(500).json(err)

    }
}
const newsFeed = async(req,res)=>{
    
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId)=>{
               return Post.find({userId: friendId});
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts))
    }catch(err){
        res.status(500).json(err)
    }
}
const getUserAllPost = async (req, res) =>{
    try{
        const user = await User.findOne({username: req.params.username});
        const posts = await Post.find({userId: user._id})
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json(err)
    }
    
}
module.exports = {addPost, updatePost, deletePost,commentPost, likePost, getPost, newsFeed,getUserAllPost}
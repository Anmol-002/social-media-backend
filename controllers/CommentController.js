import CommentModel from "../models/commentModel.js";

// comment a post
export const commentPost = async (req, res) => {
  const { userid } = req.body;
  const { text } = req.body;
  const { postid } = req.body;
  const { username } = req.body;
  try {
    const comments = await CommentModel.findOne({ postid: postid });
    if (comments) {
      comments.comment.push({ text: text, userid: userid, username: username });
      await comments.save();
      let allcomment=await CommentModel.find();
      res.status(200).json(allcomment);
    } else {
      const newComment = new CommentModel({
        postid: postid,
        comment: [{ text: text, userid: userid, username: username }],
      });
      await newComment.save();
      let allcomment = await CommentModel.find();
      res.status(200).json(allcomment);
    }
  } catch (error) {
    res.status(500).json(error);
  } 
};

export const commentGet=async(req,res)=>{
  try {
    let allcomment = await CommentModel.find();
    res.status(200).json(allcomment);
  } catch (error) {
    res.status(500).json(error);
  }
}

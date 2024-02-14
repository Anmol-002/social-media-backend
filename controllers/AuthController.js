import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";

// Register new user
export const registerUser = async (req, res) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.profilePicture, {
    folder: "users",
    //width: 150,
    width: 400,
    height: 450,
    quality: 100,
    crop: "scale",
  });
  const myCloud2 = await cloudinary.v2.uploader.upload(req.body.coverPicture, {
    folder: "users",
    //width: 150,
    width: 400,
    height: 450,
    quality: 100,
    crop: "scale",
  });
  const profilepic = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };
  const coverpic = {
    public_id: myCloud2.public_id,
    url: myCloud2.secure_url,
  };
  req.body.profilePicture=profilepic;
  req.body.coverPicture=coverpic;
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass;
  const newUser = new UserModel(req.body);
  const { username } = req.body;
  try {
    // addition new
    const oldUser = await UserModel.findOne({ username });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    // changed
    const user = await newUser.save();
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWTKEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User

// Changed
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username: username });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json({ message: "Wrong username or password" });
      } else {
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.JWTKEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

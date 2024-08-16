import userModel from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateOTP } from "../../utils/genrateOTP.js";
import { sendEmail } from "../../utils/sendEmailOTP.js";

export async function loginController(req,res) {
  try {
    // extract body
    const { email, password } = req.body;

    // check data is valid or not
    if (!email || !password) {
      return res.status(400).json({ error: "Invalid data. please try again" });
    }

    // check user is already exist or not
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not exists" });
    }

    //   check password is matche
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "password does not match.." });
    }

      
    //   check user is verified or not
    if (user.isVerified === false) {
      //   send otp
      const otp = generateOTP();
      sendEmail(email, otp);
      await userModel.updateOne({ _id: user._id }, { $set: { otp } });

      return res
        .status(200)
        .json({ isVerified: false, message: "otp sent successfully",id:user._id });
    }

    // genrate token
    const token = jwt.sign(
      { _id: user._id, email: user.email, isVerified: user.isVerified },
      process.env.SECRET_KEY
    );

    // send rsponse
    return res.status(200).json({
      data: {
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

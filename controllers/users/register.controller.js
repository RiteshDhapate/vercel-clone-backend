import userModel from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateOTP } from "../../utils/genrateOTP.js";
import { sendEmail } from "../../utils/sendEmailOTP.js";

export async function registerController(req, res) {
  try {
    // extract data from request body
    const { email, firstName, lastName, password } = req.body;

    // check data is provided or not
    if (!firstName || !lastName || !password || !email) {
      return res.status(400).json({ error: "Invalid data. please try again" });
    }

    // check user is already exist or not
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hashing password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    //   send otp
    const otp = generateOTP();
    sendEmail(email, otp);

    // create a new user
    const user = await userModel.create({
      email,
      firstName,
      lastName,
      password: hash,
      otp,
    });

    // genrate token
    const token = jwt.sign(
      { _id: user._id, email: user.email, isVerified: user.isVerified },
      process.env.SECRET_KEY
    );
    

    // send rsponse
    return res.status(200).json({
      data: {
        token,
        id:user._id
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

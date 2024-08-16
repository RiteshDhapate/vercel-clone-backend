import userModel from "../../models/user.model.js";
import jwt from "jsonwebtoken";

export async function verifyUserController(req, res) {
  try {
    // extract body
    const { id, otp } = req.body;

    // check data is valid or not
    if (!id || !otp) {
      return res.status(400).json({ error: "Invalid data. please try again" });
    }

    // check user is already exist or not
    const user = await userModel.findById({ _id: id });

    if (!user) {
      return res.status(400).json({ error: "User not exists" });
    }

    if (user.isVerified === true) {
      return res.status(400).json({ error: "User already verified..." });
    }

    // check otp is match or not
    if (otp != user.otp) {
      return res.status(400).json({ error: "otp not match..." });
    }

    const updatedUser = await userModel.updateOne(
      { _id: id },
      { $set: { isVerified: true } }
    );

    // genrate token
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        isVerified:true
      },
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

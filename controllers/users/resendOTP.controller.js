import userModel from "../../models/user.model.js";
import { generateOTP } from "../../utils/genrateOTP.js";
import { sendEmail } from "../../utils/sendEmailOTP.js";

export async function resendOTPController(req, res) {
  try {
    // extract body
    const { id } = req.body;

    // check data is valid or not
    if (!id) {
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

    //   send otp
    const otp = generateOTP();
    sendEmail(user.email, otp);

    await userModel.updateOne({ _id: id }, { $set: { otp } });

    // send rsponse
    return res.status(200).json({
      message: "otp sent successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

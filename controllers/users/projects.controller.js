import userModel from "../../models/user.model.js";
import jwt from "jsonwebtoken";


export async function projectsController(req, res) {
  try {
    //   extract body
    const { token } = req.body;

    // check token is exist or not
    if (!token) {
      return res.status(400).json({ error: "User Not Login" });
    }

    // verify token
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);

    // token is not valid then
    if (!decodedData) {
      return res.status(400).json({ error: "token is not valid" });
    }

    const id = decodedData._id;

    //   find user
    const user = await userModel.findById({ _id: id });

    //   check user is exist or not
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    //   check user is verified or not
    if (user.isVerified === false) {
      return res
        .status(400)
        .json({ error: "user not verified", isVerified: false });
    }

    //   send actual response
    return res.status(200).json({
      userName: user.firstName,
      projects: user.projects,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

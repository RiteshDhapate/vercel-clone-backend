import userModel from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateSlug } from "random-word-slugs";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { isValidGitUrl } from "../../utils/checkGitUrlValid.js";
import dotenv from "dotenv";
dotenv.config();
// constant ecs client data
const ecsClient = new ECSClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const config = {
  CLUSTER: process.env.AWS_CLUSTER_ACCESS_KEY,
  TASK: process.env.AWS_CLUSTER_TASK_ACCESS_KEY,
};

// controller
export async function deployeController(req, res) {
  try {
    //   extract data from request
    const { gitURL, slug, buildFolder, token } = req.body;
    console.log({ gitURL, slug, buildFolder, token });
    // check data is exist or not
    if (!token || !gitURL || !buildFolder) {
      return res.status(400).json({ error: "Invalid data." });
    }

    if (
      buildFolder != "dist" &&
      buildFolder != "build" &&
      buildFolder != "normal"
    ) {
      return res.status(400).json({ error: "Invalid build folder." });
    }
    if (isValidGitUrl(gitURL) === false) {
      //   check git url is valid
      return res.status(400).json({ error: "Invalid git url" });
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

    // genrate slug
    const projectSlug = slug ? slug : generateSlug();

    // Spin the container
    const command = new RunTaskCommand({
      cluster: config.CLUSTER,
      taskDefinition: config.TASK,
      launchType: "FARGATE",
      count: 1,
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "ENABLED",
          subnets: [
            "subnet-0234f3f7981ea9546",
            "subnet-06448890ff9c17443",
            "subnet-0788a5429d8978766",
          ],
          securityGroups: ["sg-0d2aa244f91c13160"],
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: "vercel-clone-main-image",
            environment: [
              { name: "GIT_REPOSITORY__URL", value: gitURL },
              { name: "PROJECT_ID", value: projectSlug },
              { name: "PROJECT_BUILD_FOLDER", value: buildFolder },
            ],
          },
        ],
      },
    });

     console.log(ecsClient, config);
    console.log("final setp");
    await ecsClient.send(command);

    console.log("project is deployed -->", projectSlug);
    // Check if the projectSlug already exists for the user
    const existingProject = user.projects.find(
      (proj) => proj.slug === projectSlug
    );

    if (!existingProject) {
      user.projects.push({
        slug: projectSlug,
        url: gitURL,
      });
      await user.save();
    }

    return res.status(200).json({ message: "project deploying", projectSlug });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
}

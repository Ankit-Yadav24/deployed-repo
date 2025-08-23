import { RunTaskCommand } from "@aws-sdk/client-ecs";
import client from "../../client/client.js";
const frontendHost = async (req, res) => {
  const config = {
    cluster: process.env.cluster,
    task: process.env.task3,
  };
  //getting the giturl and projectid
  const { giturl, projectid, techused } = req.body;

  console.log("config is", config);
  console.log("all env's are", process.env.accesskeyid,"secret is", process.env.accesskeysecret,"region is", process.env.region);
  const cmd = new RunTaskCommand({
    cluster: config.cluster,
    taskDefinition: config.task,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: ["subnet-0116e9fa22a512fc2","subnet-090ec3bdc55b382e1","subnet-004a2cb9605dcf070"],
        securityGroups: ["sg-075ea9c843014612d"],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: process.env.taskfrontendname,
          environment: [
            {
              name: "GIT_URL",
              value: giturl,
            },
            {
              name: "projectid",
              value: projectid,
            },
            {
              name: "techused",
              value: techused,
            },
            {
              name: "region",
              value: process.env.region,
            },
            {
              name: "accesskeyid",
              value: process.env.accesskeyid,
            },
            {
              name: "accesskeysecret",
              value: process.env.accesskeysecret,
            },
            {
              name: "bucket",
              value: "status-code-deploylite",
            },
          ],
        },
      ],
    },
  });
  try {
    const data = await client.send(cmd);
    console.log(data);
    return res.status(200).json({
      success: true,
      data: data,
      message: "Deployment started"
    })
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};
export { frontendHost };

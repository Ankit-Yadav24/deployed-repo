import { RunTaskCommand } from "@aws-sdk/client-ecs";
import client from "../../client/client.js";
const VirtualSpace= async (req, res) => {
  //task config
  const config = {
    cluster: process.env.cluster,
    task: process.env.task6,
  };
  //getting the giturl and projectid
  const {passwd} = req.body;

  const cmd = new RunTaskCommand({
    cluster: config.cluster,
    taskDefinition: config.task,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: ["subnet-0116e9fa22a512fc2","subnet-090ec3bdc55b382e1","subnet-004a2cb9605dcf070"],
        securityGroups:["sg-075ea9c843014612d"],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: process.env.taskvirtualspacename,
          environment: [
            {
              name: "PASSWORD",
              value: passwd,
            }
          ],
        },
      ],
    },
  });
  try {
    const data = await client.send(cmd);
    console.log(data);
    return res.send({ success: true, message: "Hosting started successfully", data: data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, message: "Error starting hosting", error: err.message });
  }
};
export { VirtualSpace };

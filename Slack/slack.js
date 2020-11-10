import { Reshuffle } from "reshuffle";
import {
  SlackConnector,
  SlackEventType,
  SlackEvents
} from "reshuffle-slack-connector";
import { TwilioConnector } from "reshuffle-twilio-connector";
const app = new Reshuffle();

const main = async () => {
  const slackConnector = new SlackConnector(app, {
    token: "xoxb-1484570284771-1497110236385-Rl4ZDszC0nvQLeHYaeb7ttF1",
    signingSecret: "a78bc69862c318274879a0d3b2a08247",
    port: "3000",
    endpoints: "/"
  });

  const twilioConnector = new TwilioConnector(app, {
    accountSid: "ACdd6bc413b4378f07b5e982a0f7b377a6",
    authToken: "88f3fed9f69ddd9c8e44e9607867aa26",
    twilioNumber: "+12566496570"
  });

  slackConnector.on(
    {
      type: SlackEventType.EVENT,
      values: {
        type: SlackEvents.MESSAGE
      }
    },
    event => {
      const { text, user, channel } = event.payload;
      console.log(
        `New Message received : ${text} from the user: ${user} in the channel: ${channel}`
      );
      twilioConnector.sendSMS(
        `New Message received : ${text} from the user: ${user} in the channel: ${channel}`,
        "+642108273786"
      );
    }
  );

  app.start();
};

main();

import { Reshuffle } from "reshuffle";
import {
  SlackConnector,
  SlackEventType,
  SlackEvents
} from "reshuffle-slack-connector";
import { TwilioConnector } from "reshuffle-twilio-connector";
import {
  SLACK_TOKEN,
  SLACK_SIGNING_SECRET,
  SLACK_PORT,
  SLACK_ENDPOINTS,
  TWILIO_ACCOUNTSID,
  TWILIO_AUTH_TOKEN,
  TWILIO_NUMBER
} from "../configuration/config.js";
const app = new Reshuffle();

const main = async () => {
  const slackConnector = new SlackConnector(app, {
    token: SLACK_TOKEN,
    signingSecret: SLACK_SIGNING_SECRET,
    port: SLACK_PORT,
    endpoints: SLACK_ENDPOINTS
  });

  const twilioConnector = new TwilioConnector(app, {
    accountSid: TWILIO_ACCOUNTSID,
    authToken: TWILIO_AUTH_TOKEN,
    twilioNumber: TWILIO_NUMBER
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

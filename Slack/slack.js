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
    token: SLACK_TOKEN,
    signingSecret: SLACK_SIGNING_SECRET,
    port: SLACK_PORT,
    endpoints: SLACK_ENDPOINTS
  });

  const twilioConnector = new TwilioConnector(app, {
    accountSid: "ACd8a6c1c5b93bbebcd114ae88e2b9088b",
    authToken: "c1ccec5223689763fa18f5381eb462e6",
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

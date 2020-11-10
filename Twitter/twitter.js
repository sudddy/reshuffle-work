import { TwitterConnector } from "reshuffle-twitter-connector";
import { HttpConnector, Reshuffle } from "reshuffle";

const app = new Reshuffle();

const twitter = new TwitterConnector(app, {
  customerKey: "pUAYC19actFe7SmplLuNZGO0t",
  customerSecret: "gFlcgHaPOcYhHYfUmmp9ZcifgX9A7eYdckZ3mq33d6Q7aldqyT"
});

const connector = new HttpConnector(app);

var followPeople = async (connectorEvent, connectorApp) => {
  let id = connectorEvent.req.params.id;
  twitter.on({ follow: id }, async (event, app) => {
    if (event.tweets.length > 0) {
      connectorEvent.res.write("followed Successfully");
    } else {
      connectorEvent.res.write("User not found. Try again!");
    }
  });
};

var searchTweets = async (connectorEvent, connectorApp) => {
  let text = connectorEvent.req.params.text;
  twitter.on({ search: text }, async (event, app) => {
    for (const tweet of event.tweets) {
      console.log(tweet.user.name, "says:", tweet.text);
    }
  });
};

/** Follow people */
connector.on({ method: "GET", path: "/follow/:id" }, followPeople);

/** seach tweets  */
connector.on({ method: "GET", path: "/search/:text" }, searchTweets);

app.start(8000);

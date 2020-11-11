import { Reshuffle } from "reshuffle";
import { GoogleSheetsConnector } from "reshuffle-google-connectors";
import fs from "fs";
import {
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_WORKSHEET_ID
} from "../configuration/config.js";
const app = new Reshuffle();

const myGoogleSheetsConnector = new GoogleSheetsConnector(app, {
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY
  },
  sheetsId: GOOGLE_WORKSHEET_ID
});

const myHandler = (event, app) => {
  let data = [];
  event.newRows.forEach(({ rows }) => {
    rows.forEach(row => {
      console.log("the list of row", row);
      data.push(row);
    });
  });

  fs.appendFile("/tmp/test.txt", JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });

  event.worksheetsChanged[0] &&
    event.worksheetsChanged[0].rowsAdded[0] &&
    console.log(
      `New line values are ${JSON.stringify(
        event.worksheetsChanged[0].rowsAdded[0]
      )}`
    );
};

myGoogleSheetsConnector.on({}, myHandler);

app.start();

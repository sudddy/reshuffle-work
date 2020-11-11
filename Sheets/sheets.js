import { Reshuffle } from "reshuffle";
import { GoogleSheetsConnector } from "reshuffle-google-connectors";
import fs from "fs";
const app = new Reshuffle();

const myGoogleSheetsConnector = new GoogleSheetsConnector(app, {
  credentials: {
    client_email: "reshuffle@natural-stacker-256902.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCZ4zB1c1tgWVT1\nzdbEkoVOmgNNN6rJo69/F3asyMGKUbaJUWdkL8P4bCrQfrpEqOm8Pzk18HSnvNpm\nkNIRwEYgeby8myfQDReT/iQ4htv/un4Icpo82hEHUUR1D9rPnMb6H2H8herKYI95\nCac4kizN2bqollNn0xM1vuOMOVTyc1vS/sz2VD/dGXhvfIEbTsVQxjIeoKPodl6R\n3elfw4KwPeKLW8ZQyYY1H0HuAj9xVEiMUnQqELGJkZLIpr8iYURKd4pqOk/ZtUqF\nxBUJGa4BbzvQ3In/ImxQp/EmpVcf1W7utGHfEQgLIcqN4/dldzzIDjI2Wcj/qlIO\nMFTRNfj/AgMBAAECggEAGymu9AxYpLkf9gNPVYNHZIhq7MZWryDlaVmK6RTGlNO3\nlKV5yoVj4gW1yPeViWkHWOMQBiVbcgAzzMbjTZ7Swgi698+rR14IO2cwnYmwa4NP\nm84ey37yYohFvSP/S4Yw2RWRBjHdL7u7l3HMwn+KyQsVl4xxTHJFgccgAzBbfi/4\nPisFJmkvpB6wB7XRf4rvbnWo12h15zba25lJrXuJeiim+xWz1S0EDPmECuI/NuQp\n4T6uSU5mG1zrcJO6hc1JsUyT14Sn6Hv3fV504kxsKjXpzc0t+roMZnL4eXwnoPTI\nwZeUpAsJ9Z/CQd6ET2qcfyQQMRI2nkl42GTp+eGSgQKBgQDYt89haZpX1wC67ij7\nWeCqt+ooxya12p/tW+bSvtpRW2B/lm8LC8OMmxZrHAJUOZXsSDCTQrRkkKnuZ5mk\nGQaTWgzDxgdDMb3fjWIt7baFxlPhmMilzngSEqFGXEI7diDJR4g1pp5CkVK0iAyF\naFJ6lYsxweqb2WzP/n6LcxjLzQKBgQC1x+d36S2OgEqS37x7A7jWZ+I/lLQO/Z8o\n7JQu6QcisCuc8XUTjIddOzHj0uw4jyBsbyQDbUa2+vZc6QlRtUOv6H0TCDdPo/xg\nJCgjSK5Bk+9bjZxOPTwTakzMgbLAX8hCuTkiwdaqjRF6i6qxxN5jFobpU3Ob9yVF\n04zo6E3D+wKBgDUqsvfE/pZ6KrWxY+B2JkX7pLioUvjeT8ndd/1P0SOQdVYXw9pD\n4o+GJLPWRUQAdKVo+HHINZVOYEIarHizowdXWjZVSMbVVy2W8/UsklCzXTTFVMRI\nqPBWHbazP5Ry4IxAvkvbOow+NroPfnLkKwfj1Cg62KGvb6B/YPA5JmYpAoGAY2Ef\nnYHAYzimDHf+/i3Bvo3atjHg4pUrj18PgDnrqb4wicPD4uUgGAtFsizc8erlqgJ0\n6N60G1NGnvLUInR7xc7PmjkSrBqV3iXGP8v7YGS1JhNcUbXOgzrJM8DwbZWv0TKc\nFvFsH5+x35I9xqQ/hGKLbUIvYSQTn4IRdj+STEMCgYACab/Afgt4nf1x+OwIXhCG\nMB/d0tFMAUOuPjOHComQkO//y2tN7Qw0V7D+nCfUuiMuzB+IsT83gp1pc3gIAY4u\n29bmoB1v/yTB72LzmAEr4m7RF5BiTvBGaVshoj6S/0HGM1SkjWBp3jmMXtmCYPqk\nxe0PmRAr69AqXXMP4DvOBg==\n-----END PRIVATE KEY-----\n"
  },
  sheetsId: "1W5HoQ_NB4f-Yen4y6w2JEIRK0mlVmEF_8EYAwKNCdj8"
});

const myHandler = (event, app) => {
  // event is { oldRows, newRows, worksheetsRemoved: WorkSheetChanges[], worksheetsAdded: WorkSheetChanges[], worksheetsChanged: WorkSheetChanges[] }
  // WorkSheetChanges is { worksheetId, rowsRemoved, rowsAdded, rowsChanged }
  console.log("New rows detected!");
  event.options.sheetIdOrTitle &&
    console.log(
      `'sheetIdOrTitle' is set in event options so it only checks for changes in sheet ${event.options.sheetIdOrTitle}`
    );

  var data = [];
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

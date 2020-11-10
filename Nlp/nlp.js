import { HttpConnector, Reshuffle, SQLStoreAdapter } from "reshuffle";
import { NlpConnector } from "reshuffle-nlp-connector";
import pkg from "pg";
const { Pool } = pkg;

const app = new Reshuffle();
const pool = new Pool();

const nlpConnector = new NlpConnector(app);
const connector = new HttpConnector(app);

const persistentStore = new SQLStoreAdapter(pool, "languages");
app.setPersistentStore(persistentStore);

var findLanguage = async (event, app) => {
  let text = event.req.params.text;
  const store = app.getPersistentStore();
  const result = nlpConnector.language(text);
  console.log(text);
  try {
    let languageSearch = (await store.get(result.name, 0)) || 0;
    languageSearch++;
    await store.set(result.name, languageSearch);
  } catch (e) {
    throw new Error("Db Error");
  }
  console.log("Name: ", result.name, " Code: ", result.code);
};

connector.on({ method: "GET", path: "/findLanguage/:text" }, findLanguage);

app.start(8080);

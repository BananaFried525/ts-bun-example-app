import express from "express";
import bodyParser from "body-parser";

import route from './routes';
import { notFoundEndpoint, setRateLimit } from "./utils/route";
import configs from "./utils/config";
import { ENVIRONMENT } from "./constants/environment";

const app = express();
const port = configs.port
const appEnv = configs.env

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(setRateLimit())

app.use('/', route);

app.use('*', notFoundEndpoint);

app.listen(port, () => {
  if (appEnv !== ENVIRONMENT.PRODUCTION) {
    console.log(`Running on http://localhost:${port}`);
  }
});
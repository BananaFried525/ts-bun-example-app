import express from "express";
import bodyParser from "body-parser";

import route from './routes';
import { notFoundEndpoint, setRateLimit } from "./utils/route";

const app = express();
const port = process.env.PORT || 3000;
const appEnv = process.env.NODE_ENV || 'development'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(setRateLimit())

app.use('/', route);

app.use('*', notFoundEndpoint);

app.listen(port, () => {
  if (appEnv !== 'production') {
    console.log('Environment:', appEnv)
    console.log(`Running on http://localhost:${port}`);
  }
});
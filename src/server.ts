import express from "express";

import route from './routes';
import { notFoundEndpoint } from "./utils/route";

const app = express();
const port = process.env.PORT;


app.use('/', route);

app.use('*', notFoundEndpoint)

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
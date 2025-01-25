import express from "express";

import route from './routes';

const app = express();
const port = process.env.PORT;


app.use('/', route);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
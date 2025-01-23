import express from "express";

import v1Route from './routes/v1';

const app = express();
const port = process.env.PORT;


app.use('/v1', v1Route);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
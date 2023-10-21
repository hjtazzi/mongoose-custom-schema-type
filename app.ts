import { env } from 'node:process';

import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import requestIp from 'request-ip';

import { DbConnection, mainPathJoin } from './src/utils';
//import * as Routes from './src/routes';

const app: Express = express();
const port = env.PORT || 3001;
const corsOptions: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ]
}

// Third-party middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(requestIp.mw());

// Express Built-in middleware


// Router-level middleware


// Connect to the database and run the server
const dbConnection = new DbConnection();
dbConnection.connect((err, result, config) => {
  if (result && config) {
    console.log("-> DB Connected to:", config.connectionString);
    console.log("-> Database name:", config.databaseName);

    return app.listen(port, () => {
      console.log("-> App listening on port:", port);
    });
  }

  return console.error(err);
});

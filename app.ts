import express from 'express';
import fileUpload from 'express-fileupload';
import logger from 'morgan';

import createIndexRouter from './routes/index'

let config: any = {};
const app = express();

// allow all requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(logger('dev'));
app.use(fileUpload());

export default function createApp(options: any) {
  config = options;
  app.use('/', createIndexRouter(config));
  return app
}

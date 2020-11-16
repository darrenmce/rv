import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Services } from '../services';

export function createAPIServer({ activityAnalyser }: Services): Express {
  const app = express();

  app.use(cors())

  app.use(morgan('short'));

  app.get('/healthz', (req, res) => {
    res.sendStatus(200);
  });

  app.get('/activity/:id', async (req, res) => {
    res.send(await activityAnalyser.getActivityAnalysis())
  });

  return app;
}

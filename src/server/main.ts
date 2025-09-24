import express from 'express';
import ViteExpress from 'vite-express';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { handlerLeague } from './api/league';

const app = express();
app.use(express.json());

app.get('/league', (req, res, next) => {
	Promise.resolve(handlerLeague(req, res)).catch(next);
});

app.use(errorHandler);

ViteExpress.listen(app, config.api.port, () =>
	console.log(`Server is listening on http://localhost:${config.api.port}`)
);

import * as express from 'express';
import * as PD from 'probability-distributions';
import * as responseTime from 'response-time';
import * as expressPrometheus from 'express-prom-bundle';
import * as promClient from 'prom-client';

promClient.collectDefaultMetrics({ timeout: 5000 });

const app = express();
const port = 3000;

const sigmaDefault = 1.0;
const muDefault = 5.0;

app.use(responseTime((req, res, time) => {
	console.log(time);
}));

app.use(expressPrometheus({includeMethod: true, buckets: [
	0.001,
	0.004,
	0.008,
	0.016,
	0.025,
	0.050,
	0.100,
	0.125,
	0.250,
	0.500,
	0.750,
	1.000,
	1.500,
	2.000,
	3.000,
	4.000,
	5.000,
	8.000,
	10.000,
	20.000,
	25.000,
	30.000]}));

app.get('/latency', (req, res) => {
	const mu : number = +req.query.mu || muDefault;
	const sigma : number = +req.query.sigma || sigmaDefault;
	const randomSleep = PD.rlnorm(1, mu, sigma);
	setTimeout(() => {
		res.send('ok');
	}, randomSleep); 
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

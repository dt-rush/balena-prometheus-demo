"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const PD = require("probability-distributions");
const responseTime = require("response-time");
const expressPrometheus = require("express-prom-bundle");
const promClient = require("prom-client");
promClient.collectDefaultMetrics({ timeout: 5000 });
const app = express();
const port = 3000;
const sigmaDefault = 1.0;
const muDefault = 5.0;
app.use(responseTime((req, res, time) => {
    console.log(time);
}));
app.use(expressPrometheus({ includeMethod: true, buckets: [
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
        30.000
    ] }));
const muGauge = new promClient.Gauge({ name: 'mu', help: 'mu of the log-normal latency-generator' });
const sigmaGauge = new promClient.Gauge({ name: 'sigma', help: 'sigma of the log-normal latency-generator' });
const handleReq = (req, res, mu, sigma) => () => {
    console.log(`mu=${mu}`);
    muGauge.set(mu);
    sigmaGauge.set(sigma);
    res.send('ok');
};
app.get('/latency', (req, res) => {
    // parse request params and use it to select a random latency from the 
    // log normal distribution 
    const mu = +req.query.mu || muDefault;
    const sigma = +req.query.sigma || sigmaDefault;
    const randomSleep = PD.rlnorm(1, mu, sigma);
    setTimeout(handleReq(req, res, mu, sigma), randomSleep);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//# sourceMappingURL=app.js.map
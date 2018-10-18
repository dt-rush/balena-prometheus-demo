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
        0.032,
        0.064,
        0.100,
        0.128,
        0.180,
        0.256,
        0.360,
        0.512,
        0.720,
        1.024,
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
app.get('/latency', (req, res) => {
    const mu = +req.query.mu || muDefault;
    const sigma = +req.query.sigma || sigmaDefault;
    const randomSleep = PD.rlnorm(1, mu, sigma);
    setTimeout(() => {
        res.send('ok');
    }, randomSleep);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//# sourceMappingURL=app.js.map
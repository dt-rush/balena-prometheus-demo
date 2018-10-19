import * as r from 'request-promise';

// several possible load distributions to blur between
const distributions = [
	[2.0, 0.8],
	[3.0, 0.5],
	[3.0, 0.8],
	[4.0, 0.5],
	[4.0, 0.8],
	[5.0, 0.5],
	[5.0, 0.8],
];

const randomDistribution = () => distributions[Math.round(Math.random() * (distributions.length - 1))];

const distributionPeriod = 5 * 60 * 1000;
const distributionBlendTargetPeriod = 1 * 60 * 1000;
const blendsPerTarget = 4;
const doRequestPeriod = 50;

export class RequestPressure {
	distribution : number[]
	blendTarget : number[]
	intervals : NodeJS.Timer[]

	constructor() {
		this.intervals = [];	
	}

	start() {
		this.distribution = randomDistribution();
		this.blendTarget = randomDistribution();
		this.intervals.push(this.distributionInterval());	
		this.intervals.push(this.distributionBlendTargetInterval());	
		this.intervals.push(this.distributionDoBlendInterval());	
		this.intervals.push(this.doRequestInterval());	
	}

	stop() {
		this.intervals.map((interval) => clearInterval(interval));
	}

	distributionInterval = () => setInterval(() => {
		this.distribution = randomDistribution();
	}, distributionPeriod)

	distributionBlendTargetInterval = () => setInterval(() => {
		this.blendTarget = randomDistribution();
	}, distributionBlendTargetPeriod)

	distributionDoBlendInterval = () => setInterval(() => {
		this.distribution = [
			(this.distribution[0] + this.blendTarget[0]) / 2,
			(this.distribution[1] + this.blendTarget[1]) / 2,
		];
	}, distributionBlendTargetPeriod / blendsPerTarget)

	doRequestInterval = () => setInterval(() => {
		r(`http://localhost:3000/latency?` +
			`mu=${this.distribution[0]}&sigma=${this.distribution[1]}`)
			.catch(() => null);
	}, doRequestPeriod)
}

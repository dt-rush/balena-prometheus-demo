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

const distributionChangePeriod = 5 * 60 * 1000;
const distributionTargetPeriod = 1 * 60 * 1000;
const blendsPerTarget = 4;
const doRequestPeriod = 50;

export class RequestPressure {
	distribution : number[]
	targetDistribution : number[]
	intervals : NodeJS.Timer[]

	constructor() {
		this.intervals = [];	
	}

	start() {
		this.distribution = randomDistribution();
		this.targetDistribution = randomDistribution();
		this.intervals.push(this.distributionChangeInterval());	
		this.intervals.push(this.distributionTargetInterval());	
		this.intervals.push(this.doBlendInterval());	
		this.intervals.push(this.doRequestInterval());	
	}

	stop() {
		this.intervals.map((interval) => clearInterval(interval));
	}

	distributionChangeInterval = () => setInterval(() => {
		this.distribution = randomDistribution();
	}, distributionChangePeriod)

	distributionTargetInterval = () => setInterval(() => {
		this.targetDistribution = randomDistribution();
	}, distributionTargetPeriod)

	doBlendInterval = () => setInterval(() => {
		this.distribution = [
			(this.distribution[0] + this.targetDistribution[0]) / 2,
			(this.distribution[1] + this.targetDistribution[1]) / 2,
		];
	}, distributionTargetPeriod / blendsPerTarget)

	doRequestInterval = () => setInterval(() => {
		r(`http://localhost:3000/latency?` +
			`mu=${this.distribution[0]}&sigma=${this.distribution[1]}`)
			.catch(() => null);
	}, doRequestPeriod)
}

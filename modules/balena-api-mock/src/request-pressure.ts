import * as r from 'request-promise';

// several possible load patterns to blur between
const patterns = [
	[2.0, 0.8],
	[3.0, 0.5],
	[3.0, 0.8],
	[4.0, 0.5],
	[4.0, 0.8],
	[5.0, 0.5],
	[5.0, 0.8],
];

const randomBlend = () => patterns[Math.round(Math.random() * (patterns.length - 1))];

const patternPeriod = 5 * 60 * 1000;
const patternBlendTargetPeriod = 1 * 60 * 1000;
const blendsPerTarget = 4;
const doRequestPeriod = 50;

export class RequestPressure {
	pattern : number[]
	blendTarget : number[]
	intervals : NodeJS.Timer[]

	constructor() {
		this.intervals = [];	
	}

	start() {
		this.pattern = randomBlend();
		this.blendTarget = randomBlend();
		this.intervals.push(this.patternInterval());	
		this.intervals.push(this.patternBlendTargetInterval());	
		this.intervals.push(this.patternDoBlendInterval());	
		this.intervals.push(this.doRequestInterval());	
	}

	stop() {
		this.intervals.map((interval) => clearInterval(interval));
	}

	patternInterval = () => setInterval(() => {
		this.pattern = randomBlend();
	}, patternPeriod)

	patternBlendTargetInterval = () => setInterval(() => {
		this.blendTarget = randomBlend();
	}, patternBlendTargetPeriod)

	patternDoBlendInterval = () => setInterval(() => {
		this.pattern = [
			(this.pattern[0] + this.blendTarget[0]) / 2,
			(this.pattern[1] + this.blendTarget[1]) / 2,
		];
	}, patternBlendTargetPeriod / blendsPerTarget)

	doRequestInterval = () => setInterval(() => {
		r(`http://localhost:3000/latency?` +
			`mu=${this.pattern[0]}&sigma=${this.pattern[1]}`)
			.catch(() => null);
	}, doRequestPeriod)
}

import { RequestPressure } from './request-pressure';

let pressure = new RequestPressure();
console.log('applying pressure... ^C to stop');
pressure.start();

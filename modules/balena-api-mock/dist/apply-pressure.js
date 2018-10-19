"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_pressure_1 = require("./request-pressure");
let pressure = new request_pressure_1.RequestPressure();
console.log('applying pressure... ^C to stop');
pressure.start();
//# sourceMappingURL=apply-pressure.js.map
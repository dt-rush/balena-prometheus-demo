/// <reference types="node" />
export declare class RequestPressure {
    pattern: number[];
    blendTarget: number[];
    intervals: NodeJS.Timer[];
    constructor();
    start(): void;
    stop(): void;
    patternInterval: () => NodeJS.Timeout;
    patternBlendTargetInterval: () => NodeJS.Timeout;
    patternDoBlendInterval: () => NodeJS.Timeout;
    doRequestInterval: () => NodeJS.Timeout;
}

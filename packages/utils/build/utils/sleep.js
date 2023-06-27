"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitFor = void 0;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const waitFor = async (f) => {
    let ret = f();
    while (!ret) {
        await sleep(50);
        ret = f();
    }
    return ret;
};
exports.waitFor = waitFor;
//# sourceMappingURL=sleep.js.map
const fs = require("fs");
const Jimp = require("jimp");


    // settings


// meta
const RESOLUTION =       1024;     // resolution of the output pics
const RESOLUTION_DOUBLE = RESOLUTION * 2;
const RESOLUTION_HALF = RESOLUTION / 2;
const ONE_OVER_RESOLUTION = 1 / RESOLUTION;
const ITER_COUNT =       6;       // number of iterations to be processed for each image
const IMAGES_COUNT =     5;       // number of images to generate
const SAVE_ALL_ITERS =   false;   // save all iterations or only the final one


// post-processing
const SATURATION_CONST = false;   // constant saturation in 0-1 range


// modes
const RANDOM_FILTERS =   false;   // randomize what filters will be used
const TEST_MODE =        false;   // all filters except test will be disabled


const FILTER_TEST = 'testfilters';
const FILTER_CIRCLES = 'circles';
const FILTER_SINLINES = 'sinlines';
const FILTER_COSLINES = 'coslines';
const FILTER_SWIRL = 'swirl';
const FILTER_TANGRAD = 'tangrad';
const FILTER_GRADIENT = 'gradient';
const FILTER_FUZZY = 'fuzzy';
const FILTER_POWREMAIN = 'powremain';
const FILTER_POWSUBTRACT = 'powsubtract';

// filters
const FILTERS = [
    // FILTER_TEST, // enable testing of the custom filter
    FILTER_CIRCLES, // enable the "circles" filter
    FILTER_SINLINES, // enable the "sinlines" filter
    FILTER_COSLINES, // enable the "coslines" filter
    FILTER_SWIRL, // enable the "swirl" filter
    FILTER_TANGRAD, // enable the "tangrad" filter
    FILTER_GRADIENT, // enable the "gradient" filter
    //FILTER_FUZZY, // enable the "fuzzy" filter - NOTE: PRETTY FUCKED ATM
    FILTER_POWREMAIN, // enable the "powremain" filter
    FILTER_POWSUBTRACT // enable the "powsubtract" filter
];

let stream = fs.createWriteStream("morph.log", {flags:'a'});
fs.writeFile('morph.log', '', (err) => {
    err && console.log(err)
}); // clean file


for (let i = 1; i <= IMAGES_COUNT; i++) {
    generate(i);
}

function getRandomizedFilterUsage(filter) {
    switch (filter) {
        case FILTER_CIRCLES:
            return getRandomInt(0, 4);
            break;
        case FILTER_SINLINES:
            return getRandomInt(0, 3);
            break;
        case FILTER_COSLINES:
            return getRandomInt(0, 3);
            break;
        case FILTER_SWIRL:
            return getRandomInt(0, 4);
            break;
        case FILTER_TANGRAD:
            return getRandomInt(0, 4);
            break;
        case FILTER_GRADIENT:
            return getRandomInt(0, 4);
            break;
        case FILTER_FUZZY:
            return getRandomInt(0, 1);
            break;
        case FILTER_POWREMAIN:
            return getRandomInt(0, 2);
            break;
        case FILTER_POWSUBTRACT:
            return getRandomInt(0, 2);
            break;
        default:
            return true;
            break;
    }
}

function logOutput(content) {
    stream.write(`[${(new Date()).toISOString()}]: ${content}\n`);
}


function getUsableFilters() {
    let usable_filters = [];

    if (TEST_MODE) {
        usable_filters.push(FILTER_TEST)
    } else if (RANDOM_FILTERS) {
        FILTERS.forEach((filter) => {
            if (getRandomizedFilterUsage(filter)) {
                usable_filters.push(filter);
            }
        });
        logOutput(`Generated with random filters: ${usable_filters}`);
    } else {
        FILTERS.forEach((filter) => {
            usable_filters.push(filter);
        });
    }

    return usable_filters
}

function generate(num) {
    let usable_filters = getUsableFilters();

    logOutput(`Image ${num} generation start.`);
    let image = new Jimp(RESOLUTION, RESOLUTION, function(err, image) {
        let again = 0
        let {width, height} = image.bitmap;

        for (let i = 1; i <= ITER_COUNT; i++) {
            logOutput(`Iteration: ${i}`);
            let randomPointX = 0;
            let randomPointY = 0;

            if (!again) {
                randomPointX = getRandomInt(-RESOLUTION, RESOLUTION_DOUBLE);
                randomPointY = getRandomInt(-RESOLUTION, RESOLUTION_DOUBLE);
            } else if (getRandomInt(0, 1)) {
                randomPointX += getRandomInt(-50, 50);
                randomPointY += getRandomInt(-50, 50);
            }

            let radius = getRandomInt(10, RESOLUTION_HALF);
            again = getRandomInt(0, 1);

            let randomFilterNumber = Math.floor(Math.random() * usable_filters.length);
            switch (usable_filters[randomFilterNumber]) {
                case FILTER_TEST:
                    testfilter(this, randomPointX, randomPointY, radius);
                    logOutput(`TESTING A NEW FILTER at X = ${randomPointX} Y = ${randomPointY} radius = ${radius}`);
                    break;
                case FILTER_CIRCLES:
                    circles(this, randomPointX, randomPointY, radius);
                    logOutput(`Circles at X = ${randomPointX} Y = ${randomPointY} radius = ${radius}`);
                    break;
                case FILTER_SINLINES:
                    sinlines(this, randomPointX, randomPointY, radius);
                    logOutput(`Sinlines at X = ${randomPointX} Y = ${randomPointY} radius = ${radius}`);
                    break;
                case FILTER_COSLINES:
                    coslines(this, randomPointX, randomPointY, radius);
                    logOutput(`Coslines at X = ${randomPointX} Y = ${randomPointY} radius = ${radius}`);
                    break;
                case FILTER_SWIRL:
                    swirl(this, randomPointX, randomPointY, radius);
                    logOutput(`Swirl at X = ${randomPointX} Y = ${randomPointY} radius = ${radius}`);
                    break;
                case FILTER_TANGRAD:
                    tangrad(this, randomPointX, randomPointY, radius);
                    logOutput(`Tangrad at X = ${randomPointX} Y = ${randomPointY} radius = ${radius}`);
                    break;
                case FILTER_GRADIENT:
                    gradient(this, randomPointX, randomPointY, radius);
                    logOutput(`Gradient at X = ${randomPointX} Y = ${randomPointY} radius = ${radius}`);
                    break;
                case FILTER_FUZZY:
                    fuzzy(this, randomPointX, randomPointY, radius);
                    logOutput(`Fuzzy at X = ${randomPointX} Y = ${randomPointY} radius = ${radius}`);
                    break;
                case FILTER_POWREMAIN:
                    powremain(this, randomPointX, randomPointY, radius);
                    logOutput(`Powremain at X = ${randomPointX} Y = ${randomPointY} radius = ${radius}`);
                    break;
                case FILTER_POWSUBTRACT:
                    powsubtract(this, randomPointX, randomPointY, radius);
                    logOutput(`Powsubtract at X = ${randomPointX} Y = ${randomPointY} radius = ${radius}`);
                    break;
                default:
                    logOutput(`None of the filters could be applied.`);
                    break;
            }

            image.scan (0, 0, width, height, function(x, y, idx) {
                this.bitmap.data[ idx + 3 ] = 255;
            });

            let hue = [
                getRandomInt(0, 255),
                getRandomInt(0, 255),
                getRandomInt(0, 255)
            ];

            if (i != ITER_COUNT && SAVE_ALL_ITERS) {
                image.write(`outp${i}.png`);
            }
        }

        const sat = SATURATION_CONST || getRandomInt(10, 100) / 100;
        const oneMinusSat = Math.abs(1 - sat);
        const getDotFromIdx = (max, data, idx) => {
            return data[idx] + Math.abs(max - data[idx]) * oneMinusSat;
        };

        image.scan(0, 0, width, height, function(x, y, idx) {
            const {data} = this.bitmap;
            const max = Math.max(
                data[idx + 0],
                data[idx + 1],
                data[idx + 2]
            );
            this.bitmap.data[idx + 0] = Math.min(getDotFromIdx(max, data, idx + 0), 255);
            this.bitmap.data[idx + 1] = Math.min(getDotFromIdx(max, data, idx + 1), 255);
            this.bitmap.data[idx + 2] = Math.min(getDotFromIdx(max, data, idx + 2), 255);
        });
        const timestamp = (new Date()).toISOString();
        image.write(`result/${timestamp}_${num}.png`);
        logOutput(`Generation end\n\n`);
        delete image
    });
}


function circles(image, randPtX, randPtY, radius) {
    const colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)];
    const {width, height, data} = image.bitmap;
    const oneOverRadius = 1 / radius;

    image.scan(0, 0, width, height, function (x, y, idx) {
        const formula = dist([randPtX, randPtY], [x, y]) * oneOverRadius;

        this.bitmap.data[idx+0] = Math.abs(data[idx+0] - colA[0] * formula);
        this.bitmap.data[idx+1] = Math.abs(data[idx+1] - colA[1] * formula);
        this.bitmap.data[idx+2] = Math.abs(data[idx+2] - colA[2] * formula);
        this.bitmap.data[idx+3] = Math.abs(data[idx+3] - colA[3] * formula);
    });
}


function sinlines(image, randPtX, randPtY, radius) {
    const colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)];
    const {width, height, data} = image.bitmap;

    image.scan(0, 0, width, height, function (x, y, idx) {
        const xpercent = x * ONE_OVER_RESOLUTION;
        const ypercent = y * ONE_OVER_RESOLUTION;
        const sin = Math.sin(xpercent + ypercent);

        this.bitmap.data[idx+0] = Math.abs(data[idx+0] + 127 + 0.5 * colA[0] * sin)
        this.bitmap.data[idx+1] = Math.abs(data[idx+1] + 127 + 0.5 * colA[1] * sin)
        this.bitmap.data[idx+2] = Math.abs(data[idx+2] + 127 + 0.5 * colA[2] * sin)
        this.bitmap.data[idx+3] = Math.abs(data[idx+3] + 127 + 0.5 * colA[3] * sin)
    });
}


function coslines(image, randPtX, randPtY, radius) {
    const colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)];
    const {width, height, data} = image.bitmap;

    image.scan(0, 0, width, height, function (x, y, idx) {
        const xpercent = x * ONE_OVER_RESOLUTION;
        const ypercent = y * ONE_OVER_RESOLUTION;
        const cosin = Math.cos(xpercent + ypercent);

        this.bitmap.data[idx+0] = Math.abs(data[idx+0] + 127 + 0.5 * colA[0] * cosin);
        this.bitmap.data[idx+1] = Math.abs(data[idx+1] + 127 + 0.5 * colA[1] * cosin);
        this.bitmap.data[idx+2] = Math.abs(data[idx+2] + 127 + 0.5 * colA[2] * cosin);
        this.bitmap.data[idx+3] = Math.abs(data[idx+3] + 127 + 0.5 * colA[3] * cosin);
    });
}


function swirl(image, randPtX, randPtY, radius) {
    const colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)];
    const {width, height, data} = image.bitmap;

    image.scan(0, 0, width, height, function (x, y, idx) {
        const distance = dist([randPtX, randPtY], [x, y]);
        const swirlFactor = (1 / distance * radius);
        this.bitmap.data[idx+0] = Math.abs(data[idx+0] - colA[0] * swirlFactor);
        this.bitmap.data[idx+1] = Math.abs(data[idx+1] - colA[1] * swirlFactor);
        this.bitmap.data[idx+2] = Math.abs(data[idx+2] - colA[2] * swirlFactor);
        this.bitmap.data[idx+3] = Math.abs(data[idx+3] - colA[3] * swirlFactor);
    });
}


function tangrad(image, randPtX, randPtY, radius) {
    const colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)];
    const colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
    const {width, height, data} = image.bitmap;

    image.scan(0, 0, width, height, function (x, y, idx) {
        const xpercent = x * ONE_OVER_RESOLUTION;
        const ypercent = y * ONE_OVER_RESOLUTION;
        const formulaA = Math.tan(xpercent);
        const formulaB = Math.tan(ypercent);
        this.bitmap.data[idx+0] = Math.abs(data[idx+0] - (colA[0] * formulaA - colB[0] * formulaB))
        this.bitmap.data[idx+1] = Math.abs(data[idx+1] - (colA[1] * formulaA - colB[1] * formulaB))
        this.bitmap.data[idx+2] = Math.abs(data[idx+2] - (colA[2] * formulaA - colB[2] * formulaB))
        this.bitmap.data[idx+3] = Math.abs(data[idx+3] - (colA[3] * formulaA - colB[3] * formulaB))
    });
}


function gradient(image, randPtX, randPtY, radius) {
    const colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)];
    const colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
    const {width, height, data} = image.bitmap;

    image.scan(0, 0, width, height, function (x, y, idx) {
        const xpercent = x * ONE_OVER_RESOLUTION;
        const ypercent = y * ONE_OVER_RESOLUTION;
        const oneMinusXPercent = 1 - xpercent;

        this.bitmap.data[idx+0] = Math.abs(data[idx+0] - (xpercent * colA[0] + oneMinusXPercent * colB[0]));
        this.bitmap.data[idx+1] = Math.abs(data[idx+1] - (xpercent * colA[1] + oneMinusXPercent * colB[1]));
        this.bitmap.data[idx+2] = Math.abs(data[idx+2] - (xpercent * colA[2] + oneMinusXPercent * colB[2]));
        this.bitmap.data[idx+3] = Math.abs(data[idx+3] - (xpercent * colA[3] + oneMinusXPercent * colB[3]));
    });
}

function fuzzy(image, randPtX, randPtY, radius) {
    const colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)];
    const {width, height, data} = image.bitmap;

    image.scan(0, 0, width, height, function (x, y, idx) {
        const formula = dist([randPtX, randPtY], [x, y]) * getRandomInt(1, 1000) / 7500;

        this.bitmap.data[idx+0] = Math.abs(data[idx+0] - Math.min(colA[0] / formula, 255));
        this.bitmap.data[idx+1] = Math.abs(data[idx+1] - Math.min(colA[1] / formula, 255));
        this.bitmap.data[idx+2] = Math.abs(data[idx+2] - Math.min(colA[2] / formula, 255));
        this.bitmap.data[idx+3] = Math.abs(data[idx+3] - Math.min(colA[3] / formula, 255));
    });
}

function powremain(image, randPtX, randPtY) {
    const colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)];
    const {width, height, data} = image.bitmap;
    const randXSin = Math.sin(randPtX);
    const randYSin = Math.sin(randPtY);

    image.scan(0, 0, width, height, function (x, y, idx) {
        const xpercent = x * ONE_OVER_RESOLUTION;
        const ypercent = y * ONE_OVER_RESOLUTION;
        const formula = Math.pow(xpercent, randXSin) % Math.pow(ypercent, randYSin);

        this.bitmap.data[idx+0] = Math.abs(data[idx+0] - Math.min(colA[0] / formula, 255));
        this.bitmap.data[idx+1] = Math.abs(data[idx+1] - Math.min(colA[1] / formula, 255));
        this.bitmap.data[idx+2] = Math.abs(data[idx+2] - Math.min(colA[2] / formula, 255));
        this.bitmap.data[idx+3] = Math.abs(data[idx+3] - Math.min(colA[3] / formula, 255));
    });
}

function powsubtract(image, randPtX, randPtY) {
    const colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)];
    const {width, height, data} = image.bitmap;
    const randXSin = Math.sin(randPtX);
    const randYSin = Math.sin(randPtY);

    image.scan(0, 0, width, height, function (x, y, idx) {
        const xpercent = x * ONE_OVER_RESOLUTION;
        const ypercent = y * ONE_OVER_RESOLUTION;
        const formula = Math.pow(xpercent, randXSin) - Math.pow(ypercent, randYSin);

        this.bitmap.data[idx+0] = Math.abs(data[idx+0] - Math.min(colA[0] / formula, 255));
        this.bitmap.data[idx+1] = Math.abs(data[idx+1] - Math.min(colA[1] / formula, 255));
        this.bitmap.data[idx+2] = Math.abs(data[idx+2] - Math.min(colA[2] / formula, 255));
        this.bitmap.data[idx+3] = Math.abs(data[idx+3] - Math.min(colA[3] / formula, 255));
    });
}

// formula = Math.abs(Math.pow(x, coef1)-Math.pow(y, Math.sin(coef2)))
// formula = Math.abs(Math.pow(xpercent, coef1)*Math.pow(ypercent, Math.sin(coef2)))

function testfilter(image, randPtX, randPtY, radius) {
    const colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)];
    const {width, height, data} = image.bitmap;
    const coef1 = getRandomInt(0, 5);
    const coef2 = getRandomInt(0, 5);

    let min = 999999;
    let max = -999999;

    image.scan(0, 0, width, height, function (x, y, idx) {
        const xpercent = x * ONE_OVER_RESOLUTION;
        const ypercent = y * ONE_OVER_RESOLUTION;
        const formula = Math.abs(Math.pow(xpercent, coef1)*Math.pow(ypercent, Math.sin(coef2)));
        max = Math.max(formula, max);
        min = Math.min(formula, min);

        this.bitmap.data[idx+0] = Math.abs(data[idx+0] - Math.min(colA[0] * formula, 255));
        this.bitmap.data[idx+1] = Math.abs(data[idx+1] - Math.min(colA[1] * formula, 255));
        this.bitmap.data[idx+2] = Math.abs(data[idx+2] - Math.min(colA[2] * formula, 255));
        this.bitmap.data[idx+3] = Math.abs(data[idx+3] - Math.min(colA[3] * formula, 255));
    });

    logOutput(`min = ${min}, max = ${max}, coef1 = ${coef1}, coef2 = ${coef2}`);
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min
}

function dist(ptA, ptB) {
    return Math.hypot(ptA[0] - ptB[0], ptA[1] - ptB[1])
}

logOutput(`End`);

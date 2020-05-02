'use strict';

const yargs = require('yargs');
const config = require('./config');
const { Processor } = require('./libs/Processor');

const argv = yargs
    .option('batchSize', {
        type: 'number',
        describe: `Optional batch size - Defaults to ${config.get('batchSize')}`
    })
    .option('baseCurrency', {
        type: 'string',
        describe: `Optional base currency - Defaults to ${config.get('baseCurrency')}`
    })
    .help()
    .alias('help', 'h')
    .argv;

if (argv.batchSize) {
    config.set('batchSize', argv.batchSize);
}
if (argv.baseCurrency) {
    config.set('baseCurrency', argv.baseCurrency);
}

let _config = {
    batchSize: config.get('batchSize'),
    baseCurrency: config.get('baseCurrency')
}
console.log('config', _config);

const processor = new Processor(_config);
processor.initialize();
processor.start();
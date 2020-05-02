'use strict';

const _ = require('lodash');
const config = require('./config.json');

function get(path) {
    return _.get(config, path, '');
}

function set(path, value) {
    return _.set(config, path, value);
}

module.exports = {
    set,
    get
}
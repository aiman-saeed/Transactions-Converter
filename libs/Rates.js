'use strict';

const request = require('./../src/common/request')
const moment = require('moment');

class Rates {
    constructor(base) {
        this._baseUrl = 'https://api.exchangeratesapi.io';
        this._base = base
        this._method = 'GET'
    }

    getExchangeRate = async (date = moment().format('YYYY-MM-DD')) => {
        let uri = `${this._baseUrl}/${date}?base=${this._base}`;
        let result = await request(this._method, uri);
        return result
    };

    getExchangeRates = async (dates) => {
        let exchangeRates = []
        for (let i = 0; i < dates.length; i++) {
            exchangeRates.push(this.getExchangeRate(dates[i]))
        }
        return await Promise.all(exchangeRates);
    }
}

module.exports = { Rates };
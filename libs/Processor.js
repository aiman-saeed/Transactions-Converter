'use strict';

const { Rates } = require('./Rates')
const { Transactions } = require('./Transactions')

const _ = require('lodash');
const moment = require('moment');

class Processor {

    constructor(config) {
        this._config = config
    }

    initialize = () => {
        this.rates = new Rates(this._config.baseCurrency);
        this.transactions = new Transactions();
    }

    start = async () => {


        let transactions = await this.transactions.getTransactionsBatch(this._config.batchSize)

        if (_.isEmpty(transactions) || !_.isArray(transactions)) {
            return 0;
        }

        let txDates = []
        for (let i = 0; i < transactions.length; i++) {
            let txDate = moment.utc(transactions[i].createdAt).format('YYYY-MM-DD');
            txDates.push(txDate);
        }

        txDates = [...new Set(txDates)];
        let exchangeRates = await this.rates.getExchangeRates(txDates);

        if (_.isEmpty(exchangeRates) || !_.isArray(exchangeRates)) {
            return 0;
        }

        // Fixing date to fetch from the same date later in POST logic
        for (let i = 0; i < exchangeRates.length; i++) {
            exchangeRates[i] = _.set(exchangeRates[i], 'date', txDates[i])
        }

        let postTransactions = []
        for (let i = 0; i < transactions.length; i++) {
            let txDate = moment.utc(transactions[i].createdAt).format('YYYY-MM-DD');
            let exchangeRate = _.filter(exchangeRates, { date: txDate })[0]
            if (_.isEmpty(exchangeRate) || !_.has(exchangeRate.rates, transactions[i].currency)) {
                return 0;
            }

            let rate = exchangeRate.rates[transactions[i].currency];
            let convertedAmount = parseFloat((transactions[i].amount / rate).toFixed(4));

            postTransactions.push({
                createdAt: transactions[i].createdAt,
                currency: transactions[i].currency,
                convertedAmount: convertedAmount,
                checksum: transactions[i].checksum
            });
        }

        let response = await this.transactions.postTransactions({ transactions: postTransactions });

        if (!response.success) {
            console.log(`${response.failed} FAILED`)
            console.log(`${response.passed} PASSED`)
            return 0
        }
        console.log(`${response.failed} FAILED`)
        console.log(`${response.passed} PASSED`)
        return 1
    }
}

module.exports = { Processor };
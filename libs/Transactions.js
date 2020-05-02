'use strict';

const request = require('./../src/common/request')

class Transactions {
    constructor() {
        this._baseUrl = 'https://7np770qqk5.execute-api.eu-west-1.amazonaws.com';

        this._get = { route: '/prod/get-transaction', method: 'GET' };
        this._process = { route: '/prod/process-transactions', method: 'POST' };
    }


    getTransaction = async () => {
        let uri = `${this._baseUrl}${this._get.route}`
        let result = await request(this._get.method, uri);
        return result
    };

    getTransactionsBatch = async (batchSize) => {
        let transactions = [];
        for (let i = 0; i < batchSize; i++) {
            transactions.push(this.getTransaction());
        }
        return await Promise.all(transactions);
    }

    postTransactions = async (body) => {
        let uri = `${this._baseUrl}${this._process.route}`
        let result = await request(this._process.method, uri, body);
        return result;
    };
}

module.exports = { Transactions };
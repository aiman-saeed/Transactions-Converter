const rp = require('request-promise');

module.exports = async (method, uri, body, json = true) => {
    const timeout = 300000; // 5minutes
    const options = {
        timeout,
        json,
        method,
        uri,
        body
    };

    let result = await rp(options);
    return result;
}

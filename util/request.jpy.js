const req = require('request');
const config = require('../config');
const url = config.jpy.target;

const sendRequest = function () {
    return new Promise((resolve, reject) => {
        req({
            url: url,
            method: 'GET',
        }, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                resolve({
                    data: body,
                });
            }
            else {
                reject(`No Response`);
            }
        });
    });
};

module.exports = sendRequest;
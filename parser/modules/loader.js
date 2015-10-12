'use strict';

const request = require('request');

class LoadUrl {
    constructor(url) {
        this.url = url;
    }

    load() {
        const p = new Promise((resolve, reject) => {
            request(this.url, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });

        return p;
    }
}

module.exports = LoadUrl;

'use strict';

const fs = require('fs');
const path = require('path');

module.exports = (data) => {
    const filename = path.join(__dirname, '../..', './data.json');
    const p = new Promise((resolve, reject) => {
        fs.writeFile(filename, JSON.stringify(data, null, 4), function(error) {
            if (error) {
                reject(Error(error));
            } else {
                resolve('JSON saved');
            }
        });
    });

    return p;
};
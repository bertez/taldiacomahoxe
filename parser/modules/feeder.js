'use strict';

const cheerio = require('cheerio');

module.exports = (html) => {
    let $ = cheerio.load(html);
    let $rows = $('#mw-content-text table td:not(:first-child) a');

    return $rows.map(function() {
        return `https://gl.wikipedia.org${$(this).attr('href')}`;
    }).get();
};

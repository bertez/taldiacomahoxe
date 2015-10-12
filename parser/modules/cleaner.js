'use strict';

const capitalize = require('./helpers').capitalize;

module.exports = (text) => {

    text = text.replace(/\[.*\]/,'');

    text = text.replace(/\(n\.\s?(\d+)\)/, '(naceu no $1)');
    text = text.replace(/\(m\.\s?(\d+)\)/, '(morreu no $1)');

    text = text.replace(/\s\s+/g, ' ');

    text = capitalize(text);

    return text;
};
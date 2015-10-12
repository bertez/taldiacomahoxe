'use strict';

const LoadUrl = require('./modules/loader');
const Processor = require('./modules/processor');
const feeder = require('./modules/feeder');
const writer = require('./modules/writer');

const feedUrl = new LoadUrl('https://gl.wikipedia.org/wiki/366_d%C3%ADas_do_ano');

feedUrl.load().then(feeder)
    .then(urls => new Processor(urls).all())
    .then(writer)
    .then(status => console.log(status))
    .catch(error => console.log(error));

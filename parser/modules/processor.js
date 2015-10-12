'use strict';

const cheerio = require('cheerio');
const LoadUrl = require('./loader');
const sleep = require('./helpers').sleep;
const capitalize = require('./helpers').capitalize;

class Processor {
    constructor(urls) {
        this.urls = urls;
        this.current = 0;
        this.end = this.urls.length;
        this.data = {};
        this.categories = {
            'Acontecementos': 'event',
            'Nacementos': 'birth',
            'Mortes': 'death'
        };

        this.months = {
            'xaneiro': 1,
            'febreiro': 2,
            'marzo': 3,
            'abril': 4,
            'maio': 5,
            'xu%C3%B1o': 6,
            'xullo': 7,
            'agosto': 8,
            'setembro': 9,
            'outubro': 10,
            'novembro': 11,
            'decembro': 12,
        };
    }

    process(index) {
        return new Promise((resolve, reject) => {
            console.log('Processing', this.urls[index]);

            let currentUrl = new LoadUrl(this.urls[index]);

            currentUrl.load().then(body => {
                    let $ = cheerio.load(body);
                    let $lists = $('#mw-content-text > ul');
                    let events = [];

                    $lists.each((i, el) => {
                        let $el = $(el);
                        let category = this.categories[$el.prevAll('h2').find('> span').html()];

                        if (category) {

                            $el.children('li').each((i, el) => {

                                let $el = $(el);
                                let raw = $(el).text();

                                if (raw.length > 4) {
                                    let yearMatch = raw.match(/^(-?\d+):?,?-?\s/);
                                    if (!yearMatch) {
                                        reject(Error('Could not find year'));
                                    }

                                    let year = yearMatch[1];

                                    if ($el.find('ul').length) {
                                        $el.find('ul li').each((i, el) => {
                                            events.push({
                                                category,
                                                year,
                                                text: capitalize($(el).text())
                                            });
                                        });
                                    } else {
                                        let text = capitalize($el.text().replace(/^-?\d+,?:?\s?-?\s/, ''));

                                        events.push({
                                            category,
                                            year,
                                            text
                                        });
                                    }
                                }
                            });
                        }
                    });

                    resolve(events);
                },
                error => reject(error)
            );

        });
    }

    parseData(index) {
        var parts = this.urls[index].match(/(\d+)_de_(.+)$/);
        return `${parts[1]}/${this.months[parts[2]]}`;
    }

    processAll(fn) {
        if (this.current < this.end) {
            sleep(3).then(() => {
                this.process(this.current).then((data) => {
                    this.data[this.parseData(this.current)] = data;
                    this.current++;
                    this.processAll(fn);
                }, (error) => fn(null, error));
            });
        } else {
            return fn(this.data);
        }
    }

    all() {
        const p = new Promise((resolve, reject) => {
            this.processAll((d, error) => {
                if (!error) {
                    resolve(d);
                } else {
                    reject(error);
                }
            });
        });

        return p;
    }
}

module.exports = Processor;

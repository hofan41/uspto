var Promise = require('bluebird');
var Cheerio = require('cheerio');
var Util = require('../util');

module.exports = function(payload) {

    return new Promise(function(resolve, reject) {

        var html = Cheerio.load(payload);

        var patentId = html('table').eq(2).find('b').eq(1).text().replace(/,/g, '');

        var returnValue = {
            patentId: patentId,
            title: html('font').eq(3).text().replace(/\n/g, '').replace(/    /g, ''),
            url: Util.getPatentUrl(patentId),
            pdf: Util.getPdfUrl(patentId)
        };

        resolve(returnValue);
    });
};
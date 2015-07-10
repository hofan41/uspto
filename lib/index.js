var Cheerio = require('cheerio');
var Promise = require('bluebird');

var Wreck = Promise.promisifyAll(require('wreck'));
var Joi = require('joi');

var internals = {};

internals.optionsSchema = Joi.object({
	query: Joi.string().required(),
	page: Joi.number().default(1).min(1)
}).required();

internals.getPdfUrl = function(patentId) {
	if (patentId.length > 8) {
		throw new Error('Patent id too large!');
	}

	if (isNaN(patentId)) {
		var regex = /[a-z]+/ig;
		var match = regex.exec(patentId);

		switch (match[0]) {
			case 'H':
				patentId = patentId.replace(match[0], match[0] + internals.getZeroes(6 - patentId.length));
				break;

			default:
				patentId = patentId.replace(match[0], match[0] + internals.getZeroes(8 - patentId.length));
				break;
		}
	} else {
		patentId = internals.getZeroes(8 - patentId.length) + patentId;
	}

	return 'http://pimg-fpiw.uspto.gov/fdd/' + patentId.substring(6) + '/' + patentId.substring(3, 6) + '/' + patentId.substring(0, 3) + '/0.pdf'
};

internals.getZeroes = function(zeroes) {
	var returnStr = '';

	for(var i = 0; i < zeroes; i++) {
		returnStr += '0';
	}

	return returnStr;
};

internals.parsePatentSearchPage = function(payload) {

	var html = Cheerio.load(payload);
	var returnValue = {
		patentList: []
	};

	var paginationText = html('i').eq(1).text();
	var regex = /([0-9]+)/g;

	returnValue.startIndex = Number(regex.exec(paginationText)[0]) - 1;
	returnValue.endIndex = Number(regex.exec(paginationText)[0]) - 1;
	returnValue.totalCount = Number(regex.exec(paginationText)[0]);

	var last = null;
	html('table').eq(1).find('td').each(function(index) {

		if (index < 2) {
			return;
		}

		switch ((index - 2) % 4) {
			case 1:
				{
					var patentId = html(this).text().replace(/,/g, '');
					last = {
						id: patentId,
						url: "http://patft1.uspto.gov/netacgi/nph-Parser?patentnumber=[ID]".replace("[ID]", patentId),
						pdf: internals.getPdfUrl(patentId)
					};
					break;
				}

			case 3:
				{
					last['title'] = html(this).text().replace(/\n/g, '').replace(/    /g, '');
					returnValue.patentList.push(last);
					break;
				}
		}
	});

	return returnValue;
};

module.exports.listPatents = function(options) {

	var result = Joi.validate(options, internals.optionsSchema);

	if (result.error) {
		return callback(result.error);
	}

	options = result.value;

	var queryString = encodeURIComponent(options.query);

	var uri = 'http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&u=%2Fnetahtml%2FPTO%2Fsearch-adv.htm&r=0&p=' + options.page + '&f=S&l=50&Query=' + queryString + '&d=PTXT';

	return Wreck.requestAsync('GET', uri, null).then(function(response) {

		return Wreck.readAsync(response, null);

	}).then(function(payload) {

		return internals.parsePatentSearchPage(payload);
	});
};
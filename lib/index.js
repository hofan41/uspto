var Promise = require('bluebird');

var Wreck = Promise.promisifyAll(require('wreck'));
var Joi = require('joi');

var Parsers = require('./parsers');
var Util = require('./util');

var internals = {};

internals.optionsSchema = Joi.object({
	query: Joi.string().required(),
	page: Joi.number().default(1).min(1)
}).required();

internals.getUrlHtml = function(url) {

	return Wreck.requestAsync('GET', url, null).then(function(response) {

		return Wreck.readAsync(response, null);
	});
}

module.exports.getPatentDetails = function(patentId) {

	return internals.getUrlHtml(Util.getPatentUrl(patentId)).then(function(payload) {

		return Parsers.patentDetails(payload);
	})
};

module.exports.listPatents = function(options) {

	var result = Joi.validate(options, internals.optionsSchema);

	if (result.error) {
		return callback(result.error);
	}

	options = result.value;

	var queryString = encodeURIComponent(options.query);

	var url = 'http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&u=%2Fnetahtml%2FPTO%2Fsearch-adv.htm&r=0&p=' + options.page + '&f=S&l=50&Query=' + queryString + '&d=PTXT';

	return internals.getUrlHtml(url).then(function(payload) {

		return Parsers.patentSearchResults(payload);
	});
};
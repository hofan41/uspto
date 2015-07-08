var Wreck = require('wreck');
var Joi = require('joi');
var Cheerio = require('cheerio');

var internals = {};

internals.optionsSchema = Joi.object({
	query: Joi.string().required(),
	page: Joi.number().default(1).min(1)
}).required();

module.exports.listPatents = function (options, callback) {

	var result = Joi.validate(options, internals.optionsSchema);

	if (result.error) {
		return callback(result.error);
	}

	options = result.value;

	var queryString = encodeURIComponent(options.query);

	var uri = 'http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&u=%2Fnetahtml%2FPTO%2Fsearch-adv.htm&r=0&p=' + options.page + '&f=S&l=50&Query=' + queryString + '&d=PTXT';
	console.log(uri);
	Wreck.request('GET', uri, null, function(err, response) {
		if (err) {
			return callback(err);
		} else {
			Wreck.read(response, null, function(err, payload) {
				if (err) {
					return callback(err);
				}

				var html = Cheerio.load(payload);
				var returnValue = [];

				var last = null;
				html('table').eq(1).find('td').each( function(index) {
					
					if (index < 2) {
						return;
					}

					switch ((index - 2) % 4) {
						case 1:
						{
							var patentNumber = Number(html(this).text().replace(/,/g, ''));
							last = {
								id: patentNumber,
								url: "http://patft1.uspto.gov/netacgi/nph-Parser?patentnumber=[ID]".replace("[ID]", patentNumber)
							};
							break;
						}

						case 3: 
						{
							last['title'] = html(this).text().replace(/\n/g, '').replace(/    /g, '');
							returnValue.push(last);
							break;
						}
					}
				});

				return callback(null, returnValue);
			})
		}
	});
};

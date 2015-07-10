var Cheerio = require('cheerio');
var Util = require('../util');

module.exports = function(payload) {

	var html = Cheerio.load(payload);
	var returnValue = {
		patentList: []
	};

	var paginationText = html('i').eq(1).text();
	var regex = /([0-9]+)/g;

	var match = regex.exec(paginationText);

	if (!match) {
		// Check if there is one result
		if (html('head title').text() === 'Single Document' && html('head meta').attr('http-equiv') === 'REFRESH') {
			// Retrieve the title of the patent.
		}

		// There are no results
		returnValue.startIndex = 0;
		returnValue.endIndex = 0;
		returnValue.totalCount = 0;

		return returnValue;

	} else {
		returnValue.startIndex = Number(match[0]) - 1;
		returnValue.endIndex = Number(regex.exec(paginationText)[0]) - 1;
		returnValue.totalCount = Number(regex.exec(paginationText)[0]);
	}

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
						url: Util.getPatentUrl(patentId),
						pdf: Util.getPdfUrl(patentId)
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

var internals = {};

module.exports = internals;

internals.getPatentUrl = function(patentId) {
	return "http://patft1.uspto.gov/netacgi/nph-Parser?patentnumber=[ID]".replace("[ID]", patentId);
};

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

	for (var i = 0; i < zeroes; i++) {
		returnStr += '0';
	}

	return returnStr;
};

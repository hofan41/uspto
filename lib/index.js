var Joi = require('joi');

var Parsers = require('./parsers');
var Util = require('./util');

var internals = {};

internals.optionsSchema = Joi.object({
    query: Joi.string().required(),
    page: Joi.number().default(1).min(1)
}).required();

module.exports.getPatentDetails = function(patentId) {

    return Util.getUrlHtml(Util.getPatentUrl(patentId)).then(function(payload) {

        return Parsers.patentDetails(payload);
    })
};

module.exports.listPatents = function(options) {

    var result = Joi.validate(options, internals.optionsSchema);

    if (result.error) {
        return callback(result.error);
    }

    options = result.value;

    return Util.getUrlHtml(Util.getQueryUrl(options)).then(function(payload) {

        return Parsers.patentSearchResults(payload);
    });
};
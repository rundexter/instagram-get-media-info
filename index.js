var _ = require('lodash'),
    util = require('./util.js'),
    instagram = require('instagram-node').instagram();

var pickInputs = {
        'mediaId': { key: 'mediaId', validate: { req: true } }
    },
    pickOutputs = {
        'username': 'user.username',
        'full_name': 'user.full_name',
        'media': 'images.standard_resolution.url',
        'caption': 'caption.text',
        'likes': 'likes.count',
        'tags': 'tags',
        'location': 'location',
        'link': 'link'
    };

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var credentials = dexter.provider('instagram').credentials(),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        // check params.
        if (validateErrors)
            return this.fail(validateErrors);

        instagram.use({ access_token: _.get(credentials, 'access_token') });
        instagram.media(inputs.mediaId, function (err, result) {

            err? this.fail(err) : this.complete(util.pickOutputs(result, pickOutputs));
        }.bind(this));
    }
};

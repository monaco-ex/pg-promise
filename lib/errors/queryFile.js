'use strict';

var $npm = {
    os: require('os'),
    utils: require('../utils'),
    minify: require('pg-minify')
};

/**
 * @class errors.QueryFileError
 * @augments Error
 * @description
 * QueryFileError class, available from the {@link errors} namespace.
 *
 * This type represents all errors related to {@link QueryFile}.
 *
 * @property {String} name
 * Standard {@link external:Error Error} property - error type name = `QueryFileError`.
 *
 * @property {String} message
 * Standard {@link external:Error Error} property - the error message.
 *
 * @property {object} stack
 * Standard {@link external:Error Error} property - the stack trace.
 *
 * @property {String} file
 * File path/name that was passed into the {@link QueryFile} constructor.
 *
 * @property {Object} options
 * Set of options that was used by the {@link QueryFile} object.
 *
 * @property {SQLParsingError} error
 * Internal $[SQLParsingError] object.
 *
 * It is set only when the error was thrown by $[pg-minify] while parsing the SQL file.
 *
 * @returns {errors.QueryFileError}
 *
 * @see QueryFile
 *
 */
function QueryFileError(error, qf) {
    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'QueryFileError';
    this.stack = temp.stack;
    if (error instanceof $npm.minify.SQLParsingError) {
        this.error = error;
        this.message = "Failed to parse the SQL.";
    } else {
        this.message = error.message;
    }
    this.file = qf.file;
    this.options = qf.options;
}

QueryFileError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: QueryFileError,
        writable: true,
        configurable: true
    }
});

/**
 * @method errors.QueryFileError.toString
 * @description
 * Creates a well-formatted multi-line string that represents the error.
 *
 * It is called automatically when writing the object into the console.
 *
 * @param {Number} [level=0]
 * Nested output level, to provide visual offset.
 *
 * @returns {String}
 */
QueryFileError.prototype.toString = function (level) {
    level = level > 0 ? parseInt(level) : 0;
    var gap0 = $npm.utils.messageGap(level),
        gap1 = $npm.utils.messageGap(level + 1),
        lines = [
            'QueryFileError {',
            gap1 + 'message: "' + this.message + '"',
            gap1 + 'options: ' + JSON.stringify(this.options),
            gap1 + 'file: "' + this.file + '"'
        ];
    if (this.error) {
        lines.push(gap1 + 'error: ' + this.error.toString(level + 1));
    }
    lines.push(gap0 + '}');
    return lines.join($npm.os.EOL);
};

QueryFileError.prototype.inspect = function () {
    return this.toString();
};

module.exports = QueryFileError;

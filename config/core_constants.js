"use strict";

/**
 * Load all the core constants from the environment variables OR define them as literals here and export them.
 *
 * @module config/core_constants
 *
 */

/**
 * Constructor for core constants
 *
 * @constructor
 */
const CoreConstants = function() {};

CoreConstants.prototype = {

  /**
   * DynamoDB API Versions.<br><br>
   *
   * @constant {string}
   *
   */
  DYNAMODB_API_VERSION: '2012-08-10',
};

module.exports = new CoreConstants();
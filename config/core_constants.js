"use strict";

/**
 * Load all the core constants from the environment variables OR define them as literals here and export them.
 *
 * @module config/core_constants
 *
 */

const rootPrefix = '..'
  , paramErrorConfig = require(rootPrefix + '/config/param_error_config')
  , apiErrorConfig = require(rootPrefix + '/config/api_error_config')
;

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

  CACHING_ENGINE:"none",

  ERROR_CONFIG: {
    param_error_config: paramErrorConfig,
    api_error_config: apiErrorConfig
  }

};

module.exports = new CoreConstants();
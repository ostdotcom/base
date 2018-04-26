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
   * DynamoDB Access Key.<br><br>
   *
   * @constant {string}
   *
   */
  DYNAMODB_ACCESS_KEY_ID: process.env.DYNAMODB_ACCESS_KEY_ID,

  /**
   * DynamoDB secret key.<br><br>
   *
   * @constant {string}
   *
   */
  DYNAMODB_SECRET_ACCESS_KEY: process.env.DYNAMODB_SECRET_ACCESS_KEY,

  /**
   * DynamoDB Region.<br><br>
   *
   * @constant {string}
   *
   */
  DYNAMODB_REGION: process.env.DYNAMODB_REGION,

  /**
   * DynamoDB API Versions.<br><br>
   *
   * @constant {string}
   *
   */
  DYNAMODB_API_VERSION: '2012-08-10',

  /**
   * DynamoDB Logger.<br><br>
   * Values: '', logger, custom logger
   *
   * @constant {object}
   *
   */
  DYNAMODB_LOGGER: console,

  /**
   * DynamoDB Max Tries.<br><br>
   * Default is 10 by the SDK
   *
   * @constant {number}
   *
   */
  DYNAMODB_MAX_RETRIES: 10
};

module.exports = new CoreConstants();
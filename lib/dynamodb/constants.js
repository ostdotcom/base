"use strict";

/**
 * Load all the dynamo db keys string.
 *
 * @module lib/dynamodb/constants
 *
 */

/**
 * Constructor for constants
 *
 * @constructor
 */
const DDBKEYConstants = function() {};

DDBKEYConstants.prototype = {

  KEY_DDB_API_VERSION: 'apiVersion',
  KEY_DDB_ACCESS_KEY_ID: 'accessKeyId',
  KEY_DDB_SECRET_ACCESS_KEY: 'secretAccessKey',
  KEY_DDB_REGION: 'region',
  KEY_DDB_LOGGER: 'logger',
  KEY_DDB_SSL_ENABLED: 'sslEnabled',
  KEY_DDB_MAX_RETRIES: 'maxRetries',

};

module.exports = new DDBKEYConstants();
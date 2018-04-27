"use strict";

/**
 * DynamoDB Libraries Base class
 *
 * @module lib/dynamodb/base
 *
 */

//Load external files
const AWS = require('aws-sdk');

const rootPrefix = "../.."
  , coreConstants = require(rootPrefix + 'config/core_constants')
;

/**
 * Constructor for base class
 *
 * @constructor
 */
let dynamoDBInstance = null ;

const Core = function () {};

Core.prototype = {

  getObject: function (options) {
    options = options || {};

    const isSslEnabled = options.sslEnabled === true
      , maxRetries = options.maxRetries || coreConstants.DYNAMODB_MAX_RETRIES
    ;
    if (dynamoDBInstance) return dynamoDBInstance;
    dynamoDBInstance = new AWS.DynamoDB({
      apiVersion: coreConstants.DYNAMODB_API_VERSION,
      accessKeyId: coreConstants.DYNAMODB_ACCESS_KEY_ID,
      secretAccessKey: coreConstants.DYNAMODB_SECRET_ACCESS_KEY,
      region: coreConstants.DYNAMODB_REGION,
      logger: coreConstants.DYNAMODB_LOGGER,
      sslEnabled: isSslEnabled,
      maxRetries: maxRetries
    });
  },
};

const coreInstance = new Core();

module.exports = {
  getInstance: function () {
    return coreInstance.getObject();
  }
};
"use strict";

/**
 * DynamoDB Libraries Base class
 *
 * @module lib/dynamodb/base
 *
 */

const rootPrefix  = "../.."
  , AWS = require('aws-sdk')
  , coreConstants = require(rootPrefix+'config/core_constants')
;

/**
 * Constructor for base class
 *
 * @constructor
 */
const Base = function() {};

Base.prototype = {

  getObject: function(options) {
    const options = options || {}
      , isSslEnabled = options.sslEnabled === true ? true : false
      , maxRetries = options.maxRetries || coreConstants.DYNAMODB_MAX_RETRIES
    ;
    return new AWS.DynamoDB({
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

module.exports = new Base();
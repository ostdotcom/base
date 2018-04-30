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
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , keyConstants = require(rootPrefix + '/lib/dynamodb/constants')
;

/**
 * Constructor for base class
 *
 * @constructor
 */
const Base = function (options) {
  const oThis = this;
  oThis.options = options;
  oThis.dynamoDBInstance = new AWS.DynamoDB({
    apiVersion: options[keyConstants.KEY_DDB_API_VERSION],
    accessKeyId: options[keyConstants.KEY_DDB_ACCESS_KEY_ID],
    secretAccessKey: options[keyConstants.KEY_DDB_SECRET_ACCESS_KEY],
    region: options[keyConstants.KEY_DDB_REGION],
    logger: options[keyConstants.KEY_DDB_LOGGER],
    sslEnabled: options[keyConstants.KEY_DDB_SSL_ENABLED],
    maxRetries: options[keyConstants.KEY_DDB_MAX_RETRIES]
  });

};

Base.prototype = {

  call: function (method, params) {
    const oThis = this
      , dbInstance = oThis.dynamoDBInstance
      , methodRef  = dbInstance[method]
    ;

    return new Promise(function (onResolve, onReject) {
      try {
        methodRef.call(dbInstance, params, function (err, data) {
          if (err) {
            onResolve(responseHelper.errorWithData({error: err.stack}, "l_dy_b_call_1", "Error while calling DB"));
          }
          else {
            logger.debug(data); // successful response
            onResolve(responseHelper.successWithData({data: data}));
          }
        });
      } catch(err) {
        logger.error("lib/dynamodb/base.js:call inside catch ", err);
        onResolve(responseHelper.errorWithData({error: err.stack}, "l_dy_b_call_2", "Exception while calling DB"));
      }
    });
  }

};

module.exports = new Base();


/*

const params = { };
  params[keyConstants.KEY_DDB_API_VERSION] = coreConstants.DYNAMODB_API_VERSION;
  params[keyConstants.KEY_DDB_ACCESS_KEY_ID] = coreConstants.DYNAMODB_ACCESS_KEY_ID;
  params[keyConstants.KEY_DDB_SECRET_ACCESS_KEY] = coreConstants.DYNAMODB_SECRET_ACCESS_KEY;
  params[keyConstants.KEY_DDB_REGION] = coreConstants.DYNAMODB_REGION;
  params[keyConstants.KEY_DDB_LOGGER] = coreConstants.DYNAMODB_LOGGER;
  params[keyConstants.KEY_DDB_SSL_ENABLED] = false;
  params[keyConstants.KEY_DDB_MAX_RETRIES] = coreConstants.DYNAMODB_MAX_RETRIES;

getDynamoDBInstance: function (options) {
    options = options || {};


    const oThis = this
      , isSslEnabled = options.sslEnabled === true
      , maxRetries = options.maxRetries || coreConstants.DYNAMODB_MAX_RETRIES
    ;

    if (!oThis.dynamoDBInstance) {
      oThis.dynamoDBInstance = new AWS.DynamoDB({
        apiVersion: coreConstants.DYNAMODB_API_VERSION,
        accessKeyId: coreConstants.DYNAMODB_ACCESS_KEY_ID,
        secretAccessKey: coreConstants.DYNAMODB_SECRET_ACCESS_KEY,
        region: coreConstants.DYNAMODB_REGION,
        logger: coreConstants.DYNAMODB_LOGGER,
        sslEnabled: isSslEnabled,
        maxRetries: maxRetries
      });
    }
    return oThis.dynamoDBInstance;
  },

 */
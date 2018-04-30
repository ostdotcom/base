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
  , keyConstants = require(rootPrefix + '/lib/dynamodb/constants')
;

/**
 * Constructor for base class
 *
 * @params {object} params - DynamoDB configurations
 *
 * @constructor
 */
const Base = function (params) {
  const oThis = this;

  oThis.ddbConfigParams = params;

  oThis.dynamoDBInstance = new AWS.DynamoDB({
    apiVersion: params[keyConstants.KEY_DDB_API_VERSION],
    accessKeyId: params[keyConstants.KEY_DDB_ACCESS_KEY_ID],
    secretAccessKey: params[keyConstants.KEY_DDB_SECRET_ACCESS_KEY],
    region: params[keyConstants.KEY_DDB_REGION],
    logger: params[keyConstants.KEY_DDB_LOGGER],
    sslEnabled: params[keyConstants.KEY_DDB_SSL_ENABLED],
    maxRetries: params[keyConstants.KEY_DDB_MAX_RETRIES]
  });

};

Base.prototype = {

  /**
   * Call dynamo db methods
   *
   * @params {string} method name
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */

  call: function (method, params) {
    const oThis = this
      , dbInstance = oThis.dynamoDBInstance
      , methodRef  = dbInstance[method]
    ;

    // validate if the DB instance is available
    if (!dbInstance) return Promise.resolve(responseHelper.error('l_dy_b_call_1', 'DDB object is missing'));

    // validate if the method is available
    if (!methodRef) return Promise.resolve(responseHelper.error('l_dy_b_call_2', 'Method name is missing'));

    // return promise
    return new Promise(function (onResolve, onReject) {
      try {
        methodRef.call(dbInstance, params, function (err, data) {
          if (err) {
            onResolve(responseHelper.errorWithData({error: err.stack}, "l_dy_b_call_3", "Error while calling DB"));
          }
          else {
            logger.debug(data); // successful response
            onResolve(responseHelper.successWithData({data: data}));
          }
        });
      } catch(err) {
        logger.error("lib/dynamodb/base.js:call inside catch ", err);
        onResolve(responseHelper.errorWithData({error: err.stack}, "l_dy_b_call_4", "Exception while calling DB"));
      }
    });
  }

};

module.exports = new Base();

"use strict";

/**
 * DynamoDB Libraries Base class
 *
 * @module lib/dynamodb/base
 *
 */

//Load external files
const AWS = require('aws-sdk');

const rootPrefix = '../..'
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , coreConstants = require(rootPrefix + "/config/core_constants")
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

  // Set Default DDB params if not passed
  params.apiVersion = params.apiVersion || coreConstants.DYNAMODB_API_VERSION;
  oThis.dynamoDBInstance = new AWS.DynamoDB(params);

};

Base.prototype = {

  /**
   * Call dynamoDB methods
   *
   * @params {string} method name
   * @params {object} params
   *
   * @return {Promise<result>}
   *
   */

  call: function (method,...methodArgs) {
    const oThis = this
      , dbInstance = oThis.dynamoDBInstance
      , methodRef  = dbInstance[method]
    ;

    // return promise
    return new Promise(function (onResolve, onReject) {
      try {

        // validate if the DB instance is available
        if (!dbInstance) return onResolve(responseHelper.paramValidationError({
          internal_error_identifier:"l_dy_b_call_1",
          api_error_identifier: "invalid_api_params",
          params_error_identifiers: ["ddb_object_missing"],
          debug_options: {},
          error_config: coreConstants.ERROR_CONFIG
        }));

        // validate if the method is available
        if (!methodRef) return onResolve(responseHelper.paramValidationError({
          internal_error_identifier:"l_dy_b_call_2",
          api_error_identifier: "invalid_api_params",
          params_error_identifiers: ["ddb_method_missing"],
          debug_options: {},
          error_config: coreConstants.ERROR_CONFIG
        }));

        methodArgs.push(function (err, data) {
          if (err) {
            logger.error("Error from DDB - ", err);
            return onResolve(responseHelper.error({
              internal_error_identifier:"l_dy_b_call_3",
              api_error_identifier: "ddb_method_call_error",
              debug_options: {error: err.stack},
              error_config: coreConstants.ERROR_CONFIG
            }));
          }
          else {
            logger.debug(data); // successful response
            return onResolve(responseHelper.successWithData(data));
          }
        });

        methodRef.apply(dbInstance,methodArgs);
      } catch(err) {
        logger.error("lib/dynamodb/base.js:call inside catch ", err);
        return onResolve(responseHelper.error({
          internal_error_identifier:"l_dy_b_call_4",
          api_error_identifier: "exception",
          debug_options: {error: err.stack},
          error_config: coreConstants.ERROR_CONFIG
        }));

      }

    });
  }
};

module.exports = Base;

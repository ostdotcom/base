"use strict";

/**
 * DynamoDB Auto scale Library Base class
 *
 * @module lib/auto_scale/base
 *
 */

//Load external files
const AWS = require('aws-sdk');

const rootPrefix = '../..'
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , responseHelper = require(rootPrefix + '/lib/response')
  , coreConstants = require(rootPrefix + "/config/core_constants")
;


/**
 * Constructor for base class
 *
 * @params {object} params - configurations
 *
 * @constructor
 */
const Base = function (params) {
  const oThis = this;

  // Set Default DDB params if not passed
  params.apiVersion = params.apiVersion || coreConstants.DYNAMODB_API_VERSION;
  oThis.autoScaling = new AWS.ApplicationAutoScaling(params);
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
      , autoScalingInstance = oThis.autoScaling
      , methodRef  = autoScalingInstance[method]
    ;
    // return promise
    return new Promise(function (onResolve) {
      try {

        // validate if the autoScaling instance is available
        if (!autoScalingInstance) return onResolve(responseHelper.paramValidationError({
          internal_error_identifier:"l_as_b_call_1",
          api_error_identifier: "invalid_api_params",
          params_error_identifiers: ["auto_scale_object_missing"],
          debug_options: {},
          error_config: coreConstants.ERROR_CONFIG
        }));

        // validate if the method is available
        if (!methodRef) return onResolve(responseHelper.paramValidationError({
          internal_error_identifier:"l_as_b_call_2",
          api_error_identifier: "invalid_api_params",
          params_error_identifiers: ["auto_scale_method_missing"],
          debug_options: {},
          error_config: coreConstants.ERROR_CONFIG
        }));

        methodArgs.push(function (err, data) {
          if (err) {
            logger.error("Error from AutoScaling ", err);
            onResolve(responseHelper.error({
              internal_error_identifier:"l_as_b_call_3",
              api_error_identifier: "auto_scale_method_call_error",
              debug_options: {error: err.stack},
              error_config: coreConstants.ERROR_CONFIG
            }));
          }
          else {
            logger.debug(data); // successful response
            onResolve(responseHelper.successWithData(data));
          }
        });

        methodRef.apply(autoScalingInstance, methodArgs);
      } catch(err) {
        logger.error("lib/auto_scale/base.js:call inside catch ", err);
        onResolve(responseHelper.errorWithData({error: err.stack}, "l_as_b_call_4", "Exception while calling AutoScaling"));
        onResolve(responseHelper.error({
          internal_error_identifier:"l_as_b_call_4",
          api_error_identifier: "auto_scale_exception",
          debug_options: {error: err.stack},
          error_config: coreConstants.ERROR_CONFIG
        }));
      }

    });
  }
};

module.exports = Base;
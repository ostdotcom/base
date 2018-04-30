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
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response')
  , responseHelper = new ResponseHelperKlass({module_name: "DDBBase"})
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

  oThis.dynamoDBInstance = new AWS.DynamoDB(params);

};

Base.prototype = {

  /**
   * Call dynamoDB methods
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

    // return promise
    return new Promise(function (onResolve, onReject) {
      try {

        // validate if the DB instance is available
        if (!dbInstance) return onResolve(responseHelper.error('l_dy_b_call_1', 'DDB object is missing'));

        // validate if the method is available
        if (!methodRef) return onResolve(responseHelper.error('l_dy_b_call_2', 'Method name is missing'));

        methodRef.call(dbInstance, params, function (err, data) {
          if (err) {
            logger.error("Error from DDB ", err);
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

module.exports = Base;

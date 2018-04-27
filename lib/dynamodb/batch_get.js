"use strict";

/**
 * DynamoDB Batch Get Table Library class
 *
 * @module lib/dynamodb/batch_get
 *
 */

const rootPrefix = "../.."
  , Core = require(rootPrefix+'config/core')
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
;

/**
 *
 * @constructor
 *
 * Constructor for batch get table class
 *
 * @params {object} params -
 * @param {JSON} params.batch_get_params - batch get params
 */
// auto scale
const BatchGet = function (params) {
  const oThis = this
  ;
  oThis.batchGetParams = params.batch_get_params;
};

BatchGet.prototype = {

  /**
   * Perform method
   *
   * @return {promise<result>}
   *
   */
  perform: async function () {
    const oThis = this
    ;
    let r = null;
    r = await oThis.batchGet();
    logger.debug("=======BatchGet.batchGet.result=======");
    logger.debug(r);
    return r;
  },

  /**
   * Validation of params
   *
   * @return {promise<result>}
   *
   */
  validateParams: function () {
    const oThis = this
    ;
  },

  /**
   * Run batch get
   *
   * @return {Promise<any>}
   *
   */
  batchGet: function () {
    const oThis = this
    ;
    return new Promise(function (onResolve) {
      Core.getInstance().batchGetItem(oThis.batchGetParams, function (err, data) {
        if (err) {
          onResolve(responseHelper.errorWithData({error: err.stack}, "l_dy_br_batchGet_1", "Error in batch get"));
        }
        else {
          logger.debug(data); // successful response
          onResolve(responseHelper.successWithData({data: data}));
        }
      });
    });
  }
};

module.exports = BatchGet;
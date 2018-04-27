"use strict";

/**
 * DynamoDB Batch Write Table Library class
 *
 * @module lib/dynamodb/batch_write
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
 * Constructor for batch write table class
 *
 * @params {object} params -
 * @param {JSON} params.batch_write_params - batch write params
 */
// auto scale
const BatchWrite = function (params) {
  const oThis = this
  ;
  oThis.batchWriteParams = params.batch_write_params;
};

BatchWrite.prototype = {

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
    r = await oThis.batchWrite();
    logger.debug("=======BatchWrite.batchWrite.result=======");
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
   * Run batch write
   *
   * @return {Promise<any>}
   *
   */
  batchWrite: function () {
    const oThis = this
    ;
    return new Promise(function (onResolve) {
      Core.getInstance().batchWriteItem(oThis.batchWriteParams, function (err, data) {
        if (err) {
          onResolve(responseHelper.errorWithData({error: err.stack}, "l_dy_bw_batchWrite_1", "Error in batch write"));
        }
        else {
          logger.debug(data); // successful response
          onResolve(responseHelper.successWithData({data: data}));
        }
      });
    });
  }
};

module.exports = BatchWrite;
"use strict";

/**
 * DynamoDB Scan Table Library class
 *
 * @module lib/dynamodb/scan
 *
 */

const rootPrefix = "../.."
  , Core = require(rootPrefix+'config/core')
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
;

/**
 *
 * @constructor
 *
 * Constructor for scan table class
 *
 * @params {object} params -
 * @param {JSON} params.scan_params - scan params
 */
// auto scale
const Scan = function (params) {
  const oThis = this
  ;
  oThis.scanParams = params.scan_params;
};

Scan.prototype = {

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
    r = await oThis.scan();
    logger.debug("=======Scan.scan.result=======");
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
   * Run scan
   *
   * @return {Promise<any>}
   *
   */
  scan: function () {
    const oThis = this
    ;
    return new Promise(function (onResolve) {
      Core.getInstance().scan(oThis.scanParams, function (err, data) {
        if (err) {
          onResolve(responseHelper.errorWithData({error: err.stack}, "l_dy_sn_scan_1", "Error in scanning item in table"));
        }
        else {
          logger.debug(data); // successful response
          onResolve(responseHelper.successWithData({data: data}));
        }
      });
    });
  }
};

module.exports = Scan;
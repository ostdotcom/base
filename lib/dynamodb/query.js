"use strict";

/**
 * DynamoDB Query Table Library class
 *
 * @module lib/dynamodb/query
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
 * Constructor for query table class
 *
 * @params {object} params -
 * @param {JSON} params.query_params - query params
 */
// auto scale
const Query = function (params) {
  const oThis = this
  ;
  oThis.queryParams = params.query_params;
};

Query.prototype = {

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
    r = await oThis.query();
    logger.debug("=======Query.query.result=======");
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
   * Run query
   *
   * @return {Promise<any>}
   *
   */
  query: function () {
    const oThis = this
    ;
    return new Promise(function (onResolve) {
      Core.getInstance().updateItem(oThis.queryParams, function (err, data) {
        if (err) {
          onResolve(responseHelper.errorWithData({error: err.stack}, "l_dy_qu_query_1", "Error in querying item in table"));
        }
        else {
          logger.debug(data); // successful response
          onResolve(responseHelper.successWithData({data: data}));
        }
      });
    });
  }
};

module.exports = Query;
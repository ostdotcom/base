"use strict";

/**
 * DynamoDB Query table service
 *
 * @module services/dynamodb/query
 *
 */

const rootPrefix  = "../.."
  , QueryKlass = require(rootPrefix+'/services/dynamodb/query')
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , moduleName = 'services/dynamodb/query'
  , responseHelper = new ResponseHelper({module_name: moduleName})
;

/**
 * Constructor for Query table service class
 *
 * @param params -
 *
 * @constructor
 */
const Query = function(params) {
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

    try {

      var r = null;
      r = oThis.validateParams();
      logger.debug("=======Query.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await new QueryKlass({query_params: oThis.queryParams}).perform();
      logger.debug("=======Query.perform.result=======");
      logger.debug(r);
    } catch (err) {
      return responseHelper.error('s_dy_ui_perform_1', 'Something went wrong. ' + err.message);
    }

  },

  /**
   * Validation of params
   *
   * @return {promise<result>}
   *
   */
  validateParams: function () {
    const oThis = this
      , MINIMUM_KEYS = 3
    ;

    if (!oThis.queryParams) {
      return responseHelper.error('l_dy_qu_validateParams_1', 'query Item params is mandatory');
    }

    if (Object.keys(oThis.queryParams) > MINIMUM_KEYS ) {
      return responseHelper.error('l_dy_qu_validateParams_2', 'query Item params have some mandatory keys missing');
    }

    return responseHelper.successWithData({});
  },

};

module.exports = Query;
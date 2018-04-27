"use strict";

/**
 * DynamoDB Update item service
 *
 * @module services/dynamodb/scan
 *
 */

const rootPrefix  = "../.."
  , ScanKlass = require(rootPrefix+'/services/dynamodb/scan')
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , moduleName = 'services/dynamodb/scan'
  , responseHelper = new ResponseHelper({module_name: moduleName})
;

/**
 * Constructor for Update item service class
 *
 * @param params -
 *
 * @constructor
 */
const Scan = function(params) {
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

    try {

      var r = null;
      r = oThis.validateParams();
      logger.debug("=======Scan.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await new ScanKlass({scan_params: oThis.scanParams}).perform();
      logger.debug("=======Scan.perform.result=======");
      logger.debug(r);
    } catch (err) {
      return responseHelper.error('s_dy_sc_perform_1', 'Something went wrong. ' + err.message);
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

    if (!oThis.scanParams) {
      return responseHelper.error('l_dy_sc_validateParams_1', 'Scan params is mandatory');
    }

    if (Object.keys(oThis.scanParams) > MINIMUM_KEYS ) {
      return responseHelper.error('l_dy_sc_validateParams_2', 'Scan params have some mandatory keys missing');
    }

    return responseHelper.successWithData({});
  }

};

module.exports = Scan;
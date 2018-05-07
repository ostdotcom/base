"use strict";

/**
 * AutoScale service base class
 *
 * @module services/auto_scale/base
 *
 */

const rootPrefix  = "../.."
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response')
  , responseHelper = new ResponseHelperKlass({module_name: "AutoScaleService"})
;


/**
 * Constructor for base service class
 *
 * @param {object} autoScaleObject - Auto Scaling object
 * @param {string} methodName - AutoScale method name
 * @param {object} params - AutoScale method params
 *
 * @constructor
 */
const Base = function(autoScaleObject, methodName, params) {
  const oThis = this
  ;

  oThis.params = params;
  oThis.autoScaleObject = autoScaleObject;
  oThis.methodName = methodName;
};

Base.prototype = {

  /**
   * Perform method
   *
   * @return {promise<result>}
   *
   */
  perform: async function () {
    const oThis = this
    ;

    var r = null;
    r = oThis.validateParams();
    logger.debug("=======Base.validateParams.result=======");
    logger.debug(r);
    if (r.isFailure()) return r;

    return oThis.executeAutoScaleRequest();

  },

  /**
   * Validation of params
   *
   * @return {result}
   *
   */
  validateParams: function () {
    const oThis = this;

    if (!oThis.methodName) {
      return responseHelper.error('l_as_b_validateParams_1', 'method name is missing.');
    }

    if (!oThis.autoScaleObject){
      return responseHelper.error('l_as_b_validateParams_2', 'DDB object is missing');
    }

    if (!oThis.params) {
      return responseHelper.error('l_as_b_validateParams_3', 'params is mandatory');
    }

    return responseHelper.successWithData({});
  },

  /**
   * Execute AutoScale request
   *
   * @return {promise<result>}
   *
   */
  executeAutoScaleRequest: async function () {
    const oThis = this
    ;
    try {

      const r = await oThis.autoScaleObject.call(oThis.methodName, oThis.params);
      logger.debug("=======Base.perform.result=======");
      logger.debug(r);
      return r;

    } catch (err) {
      logger.error("services/auto_scale/base.js:executeAutoScaleRequest inside catch ", err);
      return responseHelper.error('s_as_b_executeAutoScaleRequest_1', 'Something went wrong. ' + err.message);
    }

  },

};

module.exports = Base;
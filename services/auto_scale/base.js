"use strict";

/**
 * AutoScale service base class
 *
 * @module services/auto_scale/base
 *
 */
const rootPrefix = "../.."
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , responseHelper = require(rootPrefix + '/lib/response')
  ,coreConstants = require(rootPrefix + "/config/core_constants")
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
const Base = function (autoScaleObject, methodName, params) {
  const oThis = this
  ;
  logger.debug("=======AutoScale.Base.params=======");
  logger.debug("\nmethodName: " + methodName, "\nparams: " + params);
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
    try {
      let r = null;
      r = oThis.validateParams();
      logger.debug("=======AutoScale.Base.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = oThis.executeAutoScaleRequest();
      logger.debug("=======AutoScale.Base.executeAutoScaleRequest.result=======");
      logger.debug(r);
      return r;
    } catch (err) {
      logger.error("services/auto_scale/base.js:perform inside catch ", err);
      return responseHelper.error({
        internal_error_identifier: "s_as_b_perform_1",
        api_error_identifier: "exception",
        debug_options: {message: err.message},
        error_config: coreConstants.ERROR_CONFIG
      });

    }
  },

  /**
   * Validation of params
   *
   * @return {result}
   *
   */
  validateParams: function () {
    const oThis = this;
    // validate if the method is available
    if (!oThis.methodName) return responseHelper.paramValidationError({
      internal_error_identifier: "l_as_b_validateParams_1",
      api_error_identifier: "invalid_api_params",
      params_error_identifiers: ["auto_scale_method_missing"],
      debug_options: {},
      error_config: coreConstants.ERROR_CONFIG
    });

    if (!oThis.autoScaleObject) return responseHelper.paramValidationError({
      internal_error_identifier: "l_as_b_validateParams_2",
      api_error_identifier: "invalid_api_params",
      params_error_identifiers: ["auto_scale_object_missing"],
      debug_options: {},
      error_config: coreConstants.ERROR_CONFIG
    });

    if (!oThis.params) return responseHelper.paramValidationError({
      internal_error_identifier: "l_as_b_validateParams_3",
      api_error_identifier: "invalid_api_params",
      params_error_identifiers: ["auto_scale_params_missing"],
      debug_options: {},
      error_config: coreConstants.ERROR_CONFIG
    });

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
      , r = await oThis.autoScaleObject.call(oThis.methodName, oThis.params)
    ;

    logger.debug("=======Base.perform.result=======");
    logger.debug(r);
    return r;
  }

};

module.exports = Base;
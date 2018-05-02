"use strict";

/*
 * Standard Response Formatter
 */

const shortId = require('shortid')
;

const rootPrefix = "../.."
  , Logger = new require(rootPrefix + '/lib/logger/custom_console_logger')
  , logger  = new Logger("openstCore")
  , Result = require(rootPrefix + '/lib/formatter/result')
;

const ResponseHelperKlass = function (params) {
  const oThis = this;
  oThis.moduleName = params.module_name || 'ost-base';
  oThis.paramErrorConfig = params.param_error_config || {};
  oThis.apiErrorConfig = params.api_error_config || {};
};

/**
 * ResponseHelperKlass - Class for formatting the response
 *
 */
ResponseHelperKlass.prototype = {

  /**
   * Success with data
   *
   * @param {object} data - data to be sent with success result
   *
   * @return {result}
   */
  successWithData: function (data) {
    return new Result({success_data: data});
  },

  /**
   * Error result
   *
   * @private
   *
   * @param {object} internalErrorCode - internal error code
   * @param {object} apiErrorCode - external error code
   * @param {object} debugOptions - optional params object
   * @param {boolean} debugOptions.sendErrorEmail - boolean which decides email has to be sent out to Devs
   * @param {boolean} debugOptions.clientId - clientId for which this error was thrown
   *
   * @return {result}
   */
  error: function(internalErrorCode, apiErrorCode, debugOptions) {

    const oThis = this;

    var err_code_for_log = oThis.moduleName + '(' + internalErrorCode + ":" + shortId.generate() + ')';

    logger.error(err_code_for_log, apiErrorCode, debugOptions);

    var resultParams = {
      success_data: {},
      internal_error_code: internalErrorCode,
      param_errors: []
    };

    Object.assign(resultParams, oThis._fetchApiErrorDetails(apiErrorCode));

    return new Result(resultParams);

  },

  /**
   * Error result
   *
   * @param {object} internalErrorCode - error code
   * @param {object} apiErrorCode - external error code
   * @param {array} paramErrorCodes - error detail
   * @param {object} debugOptions - optional params object
   * @param {boolean} debugOptions.sendErrorEmail - boolean which decides email has to be sent out to Devs
   * @param {boolean} debugOptions.clientId - clientId for which this error was thrown
   *
   * @return {result}
   */
  paramValidationError: function(internalErrorCode, apiErrorCode, paramErrorCodes, debugOptions) {

    const oThis = this;

    logger.error(internalErrorCode, paramErrorCodes, debugOptions);

    var detailedParamErrors = []
      , paramErrorCode
      , paramErrorConfig
    ;

    for(var i=0; i<paramErrorCodes.length; i++) {
      paramErrorCode = paramErrorCodes[i];
      paramErrorConfig = oThis._fetchParamErrorDetails(paramErrorCode);
      detailedParamErrors.push({
        name: paramErrorConfig.name,
        msg: paramErrorConfig.message
      });
    }

    var resultParams = {
      success_data: {},
      internal_error_code: internalErrorCode,
      param_errors: detailedParamErrors
    };

    Object.assign(resultParams, oThis._fetchApiErrorDetails(apiErrorCode));

    return new Result(resultParams);

  },

  /**
   * return true if the object passed is of Result class
   *
   * @param {object} obj - object to check instanceof
   *
   * @return {bool}
   */
  isCustomResult: function(obj) {
    return obj instanceof Result
  },

  /**
   * fetch API error details from Config
   *
   * @private
   *
   * @param {String} apiErrorCode - code using which details are to be fetched
   *
   * @return {object}
   */
  _fetchApiErrorDetails: function(apiErrorCode) {

    const oThis = this;

    return oThis.apiErrorConfig[apiErrorCode] || {
      http_code: "", //TODO: Add defaults here
      code: "",
      message: "Something Went Wrong"
    };

  },

  /**
   * fetch Param error details from Config
   *
   * @private
   *
   * @param {String} apiErrorCode - code using which details are to be fetched
   *
   * @return {object}
   */
  _fetchParamErrorDetails: function(paramErrorCode) {

    const oThis = this;

    return oThis.paramErrorConfig[paramErrorCode] || {
      //TODO: Add defaults
      name: "",
      message: ""
    };

  }

};

module.exports = ResponseHelperKlass;
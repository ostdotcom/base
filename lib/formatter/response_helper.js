"use strict";

/*
 * Standard Response Formatter
 */

const shortId = require('shortid')
;

const rootPrefix = '../..'
  , Logger = require(rootPrefix + '/lib/logger/custom_console_logger')
;

const logger = new Logger('openstCore')
;

/**
 * Result Class constructor
 *
 * @param {object} params - parameters object
 * @param {string} params.success_data - external error code
 * @param {object} debugOptions - optional debug params
 *
 * @return {result}
 */
const ResultKlass = function (params) {
  const oThis = this
  ;

  oThis.params = params;
  oThis.successData = params.success_data || {};
  oThis.apiErrorIdentifier = params.api_error_identifier;
  oThis.paramsErrorIdentifiers = params.params_error_identifiers;
  oThis.internalErrorCode = params.internal_error_code || 'openst_base_default';

  oThis.success = (typeof oThis.apiErrorIdentifier === 'undefined' || oThis.apiErrorIdentifier == null);
};

ResultKlass.prototype = {

  /**
   * isSuccess - method to check if the result is a success
   *
   * @returns {boolean}
   */
  isSuccess: function () {
    const oThis = this
    ;

    return oThis.success;
  },

  /**
   * isFailure - method to check if the result is a failure
   *
   * @returns {boolean}
   */
  isFailure: function () {
    const oThis = this
    ;

    return !oThis.isSuccess();
  },

  /**
   * toHash - converts the ResultKlass object to Hash object, which can be passed to outside code not having knowledge of ResultKlass
   *
   * @param errorConfig - this is config of eror - contains keys
   * @param errorConfig.api_error_config - api error info
   * @param errorConfig.param_error_config - param error info
   *
   * @returns {object}
   */
  toHash: function (errorConfig) {
    errorConfig = errorConfig || {};

    const oThis = this
      , paramErrorConfig = errorConfig.param_error_config || {}
      , apiErrorConfig = errorConfig.api_error_config || {}
      , apiErrInfo = oThis._fetchApiErrorInfo(apiErrorConfig, oThis.apiErrorIdentifier)
      , formattedData = {}
    ;

    if (!oThis.success) {
      formattedData.success = false;
      formattedData.err = {
        code: apiErrInfo.code,
        msg: apiErrInfo.message,
        param: oThis._fetchDetailedParamErrors(paramErrorConfig),
        internal_id: oThis.internalErrorCode || "ost_base_error"
      };
    } else {
      formattedData.success = true;
      formattedData.code = 200;
      formattedData.data = oThis.successData;
    }

    return formattedData;
  },

  /**
   * renderResponse - return the final response along with status
   * @param res
   * @param errorConfig - this is config of eror - contains keys
   * @param errorConfig.api_error_config - api error info
   * @param errorConfig.param_error_config - param error info
   */
  renderResponse: function (res, errorConfig) {

    errorConfig = errorConfig || {};

    const formattedResponse = oThis.toHash(errorConfig);
    const status = oThis._fetchHttpCode(errorConfig.api_error_config || {});

    return res.status(status).json(formattedResponse);
  },

  /**
   * renderResponse - return the final response along with status
   * @param paramErrorConfig - object having the param error info
   *
   * @returns {Array}
   */
  _fetchDetailedParamErrors: function (paramErrorConfig) {
    const oThis = this
      , detailedParamErrors = []
    ;

    for (var i = 0; i < oThis.paramsErrorIdentifiers.length; i++) {
      let paramErrorIdentifier = oThis.paramsErrorIdentifiers[i];
      let errInfo = oThis._fetchParamErrorDetails(paramErrorConfig, paramErrorIdentifier);
      detailedParamErrors.push({
        name: errInfo.name,
        msg: errInfo.message
      });
    }

    return detailedParamErrors;
  },

  /**
   * fetch API error details from Config
   *
   * @private
   *
   * @param {String} apiErrorIdentifier - code using which details are to be fetched
   *
   * @return {object}
   */
  _fetchApiErrorInfo: function (apiErrorConfig, apiErrorIdentifier) {

    const oThis = this;
    return apiErrorConfig[apiErrorIdentifier] || {
      code: "",
      message: "Something went wrong"
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
  _fetchParamErrorDetails: function (paramErrorConfig, paramErrorCode) {

    const oThis = this;

    return paramErrorConfig[paramErrorCode] || {
      //TODO: Add defaults
      name: "something went wrong",
      message: "something went wrong"
    };

  },

  /**
   * fetch response http code
   *
   * @private
   *
   * @param {String} apiErrorConfig - api error config
   *
   * @return {object}
   */
  _fetchHttpCode: function (apiErrorConfig) {
    const oThis = this;

    return (apiErrorConfig[oThis.apiErrorIdentifier] || {}).http_code || '200';
  }

};

const ResponseHelperKlass = function (params) {
  const oThis = this
  ;

  oThis.moduleName = params.module_name || 'ost-base';
};

/**
 * ResponseHelperKlass - Helper Class for constructing the ResultKlass object and formatting it.
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
    return new ResultKlass({success_data: data});
  },

  /**
   * Error result
   *
   * @param {string} internalErrorCode - internal error code
   * @param {string} apiErrorCode - external error code
   * @param {object} debugOptions - optional debug params
   *
   * @return {result}
   */
  error: function (internalErrorCode, apiErrorCode, debugOptions) {

    const oThis = this
      , err_code_for_log = oThis.moduleName + '(' + internalErrorCode + ":" + shortId.generate() + ')';

    logger.error(err_code_for_log, apiErrorCode, debugOptions);

    const resultParams = {
      success_data: {},
      internal_error_code: internalErrorCode,
      api_error_identifier: apiErrorCode,
      params_error_identifiers: []
    };

    return new ResultKlass(resultParams);

  },

  /**
   * Error result
   *
   * @param {object} internalErrorCode - error code
   * @param {object} apiErrorIdentifier - external error code
   * @param {Array} paramsErrorIdentifiers - error detail
   * @param {object} debugOptions - optional debug params
   *
   * @return {result}
   */
  paramValidationError: function (internalErrorCode, apiErrorIdentifier, paramsErrorIdentifiers, debugOptions) {
    const oThis = this
    ;

    logger.error(internalErrorCode, paramsErrorIdentifiers, debugOptions);

    const resultParams = {
      success_data: {},
      internal_error_code: internalErrorCode,
      api_error_identifier: apiErrorIdentifier,
      params_error_identifiers: paramsErrorIdentifiers
    };

    return new ResultKlass(resultParams);

  },

  /**
   * return true if the object passed is of Result class
   *
   * @param {object} obj - object to check instanceof
   *
   * @return {boolean}
   */
  isCustomResult: function (obj) {
    return obj instanceof ResultKlass
  }

};

module.exports = ResponseHelperKlass;
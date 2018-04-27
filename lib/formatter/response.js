"use strict";

/*
 * Standard Response Formatter
 */

const shortId = require('shortid')
;

const rootPrefix = "../.."
  , Logger = new require(rootPrefix + '/lib/logger/custom_console_logger')
  , logger  = new Logger("openstCore")
  , errorConfig = require(rootPrefix + '/lib/formatter/error_config.json')
;

/**
 * Result - Class constructor for creating Result object
 * @param data
 * @param err_code
 * @param error_detail
 * @constructor
 */

function Result(data, err_code, error_detail) {

  this.success = (typeof err_code === undefined || typeof err_code === "undefined" || err_code == null);

  this.data = data || {};

  error_detail = error_detail || {};
  const paramErrors = error_detail.paramErrors || [];

  delete error_detail.paramErrors;

  error_detail.http_code = error_detail.http_code || 200;

  if (!this.success) {
    this.code = Number(error_detail.http_code);
    this.err = {
      code: errorConfig[error_detail.http_code].name,
      msg: errorConfig[error_detail.http_code].message,
      param: paramErrors,
      error_data: error_detail,
      internal_id: err_code
    };
  }

  // Check if response has success
  this.isSuccess = function () {
    return this.success;
  };

  // Check if response is not success. More often not success is checked, so adding a method.
  this.isFailure = function () {
    return !this.isSuccess();
  };

  this.toHash = function () {
    var s = {};
    if (this.success) {
      s.success = true;
      s.data = this.data;
    } else {
      s.success = false;
      if (this.data instanceof Object && Object.keys(this.data).length > 0) {
        //Error with data case.
        s.data = this.data;
      }
      s.err = this.err;
    }

    return s;
  };


  // Render final error or success response
  this.renderResponse = function (res, status) {
    status = status || 200;
    //logger.requestCompleteLog(status);
    return res.status(status).json(this.toHash());
  };

}

const ResponseHelperKlass = function (params) {
  const oThis = this;
  oThis.moduleName = params.module_name;
};


/**
 * ResponseHelperKlass - Class for formatting the response
 *
 */
ResponseHelperKlass.prototype = {

  Result: Result,

  /**
   * Success with data
   *
   * @param {object} data - data to be sent with success result
   *
   * @return {result}
   */
  successWithData: function (data) {
    return new Result(data);
  },

  /**
   * Error result
   *
   * @private
   *
   * @param {object} err_code - error code
   * @param {string} err_msg - error message
   * @param {object} internal_error_detail - error detail
   * @param {object} options - optional params object
   * @param {boolean} options.sendErrorEmail - boolean which decides email has to be sent out to Devs
   * @param {boolean} options.clientId - clientId for which this error was thrown
   *
   * @return {result}
   */
  error: function(err_code, err_msg, internal_error_detail, options) {

    const oThis = this;

    var err_code_for_log = oThis.moduleName + '(' + err_code + ":" + shortId.generate() + ')';

    logger.error(err_code_for_log, err_msg, internal_error_detail);

    return new Result({}, err_code_for_log, internal_error_detail);

  },

  // Generate error response object
  errorWithData: function (data, errCode, errMsg) {
    const oThis = this;
    errCode = oThis.moduleName + '(' + errCode + ":" + shortId.generate() + ')';

    logger.error(errCode, errMsg);
    return new Result(data, errCode);
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
   * Error result
   *
   * @param {object} internal_code - error code
   * @param {array} paramErrors - error detail
   *
   * @return {result}
   */
  paramValidationError: function(internal_code, paramErrors) {

    const oThis = this;

    return oThis.error(internal_code, 'API Param Validation Errors', {paramErrors: paramErrors});

  },

  /**
   * Error 400 - Custom error for returning 400
   *
   * @param internal_code
   * @param err_msg
   * @param paramErrors
   * @param options
   * @returns {result}
   */
  error400: function(internal_code, err_msg, paramErrors, options){
    const oThis = this;

    return oThis.error(internal_code, err_msg, { paramErrors: paramErrors, http_code: "400" }, options);
  },

  /**
   * Error 404 - Custom error for returning 404
   *
   * @param internal_code
   * @param err_msg
   * @param paramErrors
   * @param options
   * @returns {result}
   */
  error404: function(internal_code, err_msg, paramErrors, options){
    const oThis = this;

    return oThis.error(internal_code, err_msg, { paramErrors: paramErrors, http_code: "404" }, options);
  },

  /**
   * Error 422 - Custom error for returning 422
   *
   * @param internal_code
   * @param err_msg
   * @param paramErrors
   * @param options
   * @returns {result}
   */
  error422: function(internal_code, err_msg, paramErrors, options){
    const oThis = this;

    return oThis.error(internal_code, err_msg, { paramErrors: paramErrors, http_code: "422" }, options);
  },

  /**
   * Error 401 - Custom error for returning 401
   *
   * @param internal_code
   * @param err_msg
   * @param paramErrors
   * @param options
   * @returns {result}
   */
  error401: function(internal_code, err_msg, paramErrors, options) {

    const oThis = this;

    return oThis.error(internal_code, err_msg, { paramErrors: paramErrors, http_code: "401" }, options);
  },

  /**
   * Error 409 - Custom error for returning 409
   *
   * @param internal_code
   * @param err_msg
   * @param paramErrors
   * @param options
   * @returns {result}
   */
  error409: function(internal_code, err_msg, paramErrors, options) {

    const oThis = this;

    return oThis.error(internal_code, err_msg, { paramErrors: paramErrors, http_code: "401" }, options);
  }

};

module.exports = ResponseHelperKlass;
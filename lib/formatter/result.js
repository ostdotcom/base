"use strict";

/*
 * Standard Result Object
 */

const rootPrefix = "../.."
;

/**
 * Result - Class for result of an Api Call
 *
 * @param params
 * @constructor
 */

const ResultKlass = function (params) {
  
  const oThis = this
    , errorCode = params.errorCode
  ;

  oThis.params = params;
  oThis.successData = params.successData || {};

  oThis.success = (typeof errorCode === undefined || typeof errorCode === "undefined" || errorCode == null);

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
   * toHash - return the final response hash
   *
   * @returns {{}}
   */
  toHash: function () {
    const oThis = this
    ;

    var s = {};

    if (!oThis.success) {
      s.success = false;
      s.code = oThis.params.http_code;
      s.err = {
        code: oThis.params.errorCode,
        msg: oThis.params.message,
        param: oThis.params.paramErrors,
        internal_id: oThis.params.internalErrorCode || "ost_base_error"
      };

      if (this.data instanceof Object && Object.keys(this.data).length > 0){
        s.data = oThis.successData;
      }
    } else {
      s.success = true;
      s.code = 200;
      s.data = oThis.successData;
    }

    return s;
  },

  /**
   * renderResponse - return the final response along with status
   * @param res
   * @param status
   * @returns { JSON | Promise<any> }
   */
  renderResponse: function (res, status) {
    const oThis = this
    ;

    status = status || 200;
    //TODO: Handle this somehow ?
    //logger.requestCompleteLog(status);
    return res.status(status).json(oThis.toHash());
  }
  
};

module.exports = ResultKlass;
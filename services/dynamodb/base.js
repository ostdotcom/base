"use strict";

/**
 * DynamoDB service base class
 *
 * @module services/dynamodb/base
 *
 */

const rootPrefix  = "../.."
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response')
  , responseHelper = new ResponseHelperKlass({module_name: "DDBBaseService"})
;


/**
 * Constructor for base service class
 *
 * @param {object} ddbObject - connection object
 * @param {string} methodName - DDB method name
 * @param {object} params - DDB method params
 *
 * @constructor
 */
const Base = function(ddbObject, methodName, params) {
  const oThis = this
  ;

  oThis.params = params;
  oThis.ddbObject = ddbObject;
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

    return oThis.executeDdbRequest();

  },

  /**
   * Execute dynamoDB request
   *
   * @return {promise<result>}
   *
   */
  executeDdbRequest: async function () {
    const oThis = this
    ;

    try {

      const r = await oThis.ddbObject.call(oThis.methodName, oThis.params);
      logger.debug("=======Base.perform.result=======");
      logger.debug(r);
      return r;

    } catch (err) {
      logger.error("services/dynamodb/base.js:executeDdbRequest inside catch ", err);
      return responseHelper.error('s_dy_b_executeDdbRequest_1', 'Something went wrong. ' + err.message);
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

    if (!oThis.methodName) {
      return responseHelper.error('l_dy_b_validateParams_1', 'method name is missing.');
    }

    if (!oThis.ddbObject){
      return responseHelper.error('l_dy_b_validateParams_2', 'DDB object is missing');
    }

    if (!oThis.params) {
      return responseHelper.error('l_dy_b_validateParams_3', 'params is mandatory');
    }

    return responseHelper.successWithData({});
  },

};

module.exports = Base;
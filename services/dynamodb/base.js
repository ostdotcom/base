"use strict";

/**
 * DynamoDB service base class
 *
 * @module services/dynamodb/base
 *
 */

const rootPrefix  = "../.."
  //, dbBase = require(rootPrefix + "/lib/dynamodb/base")
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response')
  , responseHelper = new ResponseHelperKlass({module_name: "DDBBaseService"})
;


/**
 * Constructor for base service class
 *
 * @param params -
 *
 * @constructor
 */
const Base = function(methodName, params, ddbObject) {
  const oThis = this
  ;
  oThis.params = params;
  oThis.ddbObject = ddbObject;
  oThis.methodName = methodName;

  /*if (!ddbConfigParams) {
    oThis.dbObject = getdefaultDDBObject();
  } else {
    oThis.dbObject = new dbBase(ddbConfigParams);
  }
  */
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

      var r = null;
      r = oThis.validateParams();
      logger.debug("=======Base.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await oThis.dbObject.call(oThis.methodName, oThis.params);
      logger.debug("=======Base.perform.result=======");
      logger.debug(r);
    } catch (err) {
      logger.error("services/dynamodb/base.js:perform inside catch ", err);
      return responseHelper.error('s_dy_b_perform_2', 'Something went wrong. ' + err.message);
    }

  },

  /**
   * Validation of params
   *
   * @return {result}
   *
   */
  validateParams: function () {
    const oThis = this
      , MINIMUM_KEYS = 3
    ;

    if (!oThis.methodName) {
      return responseHelper.error('l_dy_b_validateParams_1', 'method name is missing.');
    }

    if (!oThis.dbObject){
      return responseHelper.error('l_dy_b_validateParams_2', 'DDB object is missing');
    }

    if (!oThis.params) {
      return responseHelper.error('l_dy_b_validateParams_3', 'params is mandatory');
    }

    if (Object.keys(oThis.params) > MINIMUM_KEYS ) {
      return responseHelper.error('l_dy_b_validateParams_4', 'params have some mandatory keys missing');
    }

    return responseHelper.successWithData({});
  },

};

module.exports = Base;
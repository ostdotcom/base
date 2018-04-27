"use strict";

/**
 * DynamoDB Describe Table service
 *
 * @module services/dynamodb/describe_table
 *
 */

const rootPrefix  = "../.."
  , CreateTableKlass = require(rootPrefix+'/lib/dynamodb/create_table')
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , moduleName = 'services/dynamodb/create_table'
  , responseHelper = new ResponseHelper({module_name: moduleName})
;

/**
 * Constructor for describe table service class
 *
 * @constructor
 */
const DescribeTable = function(params) {
  const oThis = this
  ;
  oThis.params = params;
};

DescribeTable.prototype = {

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
      logger.debug("=======CreateTable.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await new CreateTableKlass(oThis.params).perform();
      logger.debug("=======CreateTable.perform.result=======");
      logger.debug(r);
    } catch(err){
      return responseHelper.error('s_dy_dt_perform_1', 'Something went wrong. ' + err.message);
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
    ;

    if (!oThis.params) {
      return responseHelper.error('l_dy_dt_validateParams_1', 'Describe table params is mandatory');
    }

    return responseHelper.successWithData({});
  },

};

module.exports = DescribeTable;
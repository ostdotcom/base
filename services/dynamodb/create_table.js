"use strict";

/**
 * DynamoDB Create Table service
 *
 * @module services/dynamodb/create_table
 *
 */

const rootPrefix  = "../.."
  , CreateTableKlass = require(rootPrefix+'/lib/dynamodb/create_table')
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
;

/**
 * Constructor for create table service class
 *
 * @constructor
 */
const CreateTable = function(params) {
  const oThis = this
  ;
  oThis.params = params;
};

CreateTable.prototype = {

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
      return responseHelper.error('s_dy_ct_perform_1', 'Something went wrong. ' + err.message);
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

    if (!oThis.createTableParams) {
      return responseHelper.error('l_dy_ct_validateParams_1', 'Create table params is mandatory');
    }

    return responseHelper.successWithData({});
  },

};

module.exports = CreateTable;
"use strict";

/**
 * DynamoDB service api
 *
 * @module services/dynamodb/table_exists
 *
 */

const rootPrefix  = "../.."
  , DDBServiceBaseKlass = require(rootPrefix + "/services/dynamodb/base")
  , responseHelper = new ResponseHelperKlass({module_name: "TableExist"})
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
;

/**
 * Constructor for TableExist service class
 *
 * @params {object} ddbObject - DynamoDB Object
 * @params {object} params - TableExist configurations
 *    @params {string} TableName - name of table
 *
 * @constructor
 */
const TableExist = function(ddbObject, params) {
  const oThis = this
  ;

  DDBServiceBaseKlass.call(oThis, ddbObject, 'listTables', params);
};

TableExist.prototype = {

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
      logger.debug("=======TableExist.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      return oThis.checkTableExists();
    } catch (err) {
      logger.error("services/dynamodb/table_exists.js:perform inside catch ", err);
      return responseHelper.error('s_dy_te_perform_1', 'Something went wrong. ' + err.message);
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
      , baseValidationResponse = DDBServiceBaseKlass.prototype.validateParams.call(oThis)
    ;
    if (baseValidationResponse.isFailure()) return baseValidationResponse;

    if (!oThis.params.TableName) return responseHelper.error('l_dy_te_validateParams_1', 'TableName is mandatory');

    return responseHelper.successWithData({});
  },

  /**
   * Check if Table exists using describe table
   *
   * @params {object} params
   *
   * @return {bool} true/false
   *
   */
  checkTableExists: async function(params) {
    const oThis = this
    ;
    const listTablesResponse = await oThis.ddbObject.call('listTables', oThis.params);
    if (listTablesResponse.isFailure()) {
      return false;
    }
    return listTablesResponse.indexOf(params.TableName) > -1;
  },

};

TableExist.prototype.constructor = TableExist;
module.exports = TableExist;


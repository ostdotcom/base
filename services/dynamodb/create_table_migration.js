"use strict";

/**
 * DynamoDB create table migration having multiple services
 *  1. Create table
 *  2. Check active table status
 *  2. Enable continuous back up
 *  3. Enable auto scaling
 *
 * @module services/dynamodb/create_table_migration
 *
 */

const rootPrefix  = "../.."
  , DDBServiceBaseKlass = require(rootPrefix + "/services/dynamodb/base")
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response')
  , responseHelper = new ResponseHelperKlass({module_name: "TableExist"})
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
;

/**
 * Constructor for TableExist service class
 *
 * @params {object} ddbObject - DynamoDB Object
 * @params {object} params - TableExist configurations
 * @params {string} TableName - name of table
 *
 * @constructor
 */
const CreateTableMigration = function(ddbObject, params) {
  const oThis = this
  ;
  oThis.params = params;
};

CreateTableMigration.prototype = {

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

      r = await oThis.checkTableExist();
      logger.debug("=======TableExist.checkTableExist.result=======");
      logger.debug(r);
      return r;
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
   * @return {Promise} true/false
   *
   */
  checkTableExist: function() {
    const oThis = this
    ;
    return new Promise(async function (onResolve) {
      DDBServiceBaseKlass.call(oThis, oThis.ddbObject, 'createTable', oThis.params);
      const listTableResponse = await oThis.ddbObject.call('createTable', {});
      if (listTableResponse.isFailure()) {
        return onResolve(responseHelper.successWithData({response: false}));
      }
      const allTables = listTableResponse.data.TableNames || [];
      const isTableExist = allTables.indexOf(oThis.params.TableName) > -1;
      return onResolve(responseHelper.successWithData({response: isTableExist}));
    });
  },

};

CreateTableMigration.prototype.constructor = CreateTableMigration;
module.exports = CreateTableMigration;
"use strict";

/**
 * DynamoDB service api
 *
 * @module services/dynamodb/table_exists
 *
 */

const rootPrefix  = "../.."
  , DDBServiceBaseKlass = require(rootPrefix + "/services/dynamodb/base")
  , responseHelper = require(rootPrefix + '/lib/response')
  , coreConstants = require(rootPrefix + "/config/core_constants")
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

  DDBServiceBaseKlass.call(oThis, ddbObject, 'describeTable', params);
};

TableExist.prototype = Object.create(DDBServiceBaseKlass.prototype);

const TableExistPrototype = {

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

    if (!oThis.params.TableName) return responseHelper.paramValidationError({
        internal_error_identifier:"l_dy_te_validateParams_1",
        api_error_identifier: "invalid_api_params",
        params_error_identifiers: ["table_name_mandatory"],
        debug_options: {},
        error_config: coreConstants.ERROR_CONFIG
    });

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
  executeDdbRequest: function() {
    const oThis = this
    ;
    return new Promise(async function (onResolve) {
      const describeTableResponse = await oThis.ddbObject.call('describeTable', oThis.params);
      if (describeTableResponse.isFailure()) {
        return onResolve(responseHelper.successWithData({response: false, status: "DELETED"}));
      }
      const tableStatus = describeTableResponse.data.Table.TableStatus || "";
      return onResolve(responseHelper.successWithData({response: tableStatus === "ACTIVE", status: tableStatus}));
    });
  },

};

Object.assign(TableExist.prototype, TableExistPrototype);
TableExist.prototype.constructor = TableExist;
module.exports = TableExist;
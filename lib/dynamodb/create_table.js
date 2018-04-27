"use strict";

/**
 * DynamoDB Create Table Library class
 *
 * @module lib/dynamodb/create_table
 *
 */

const rootPrefix  = "../.."
  , Core = require(rootPrefix+'/lib/dynamodb/core')
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , moduleName = 'lib/dynamodb/create_table'
  , responseHelper = new ResponseHelper({module_name: moduleName})
;

/**
 * Constructor for create table class
 *
 * @constructor
 */
// TODO auto scale
// TODO Backup table
const CreateTable = function(params) {
  const oThis = this
  ;
  oThis.createTableParams = params.create_table_params;

};

CreateTable.prototype = {

  /**
   * Perform method
   *
   * @return {promise<result>}
   *
   */
  perform: async function() {
    const oThis = this
    ;
    var r = null;

    r = oThis.validateParams();
    if (r.isFailure()) return r;

    r = await oThis.create();
    return r;

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

    return responseHelper.successWithData({});
  },

  /**
   * Create DynamoDB Table
   *
   * @return {Promise<result>}
   *
   */
  create: function () {
    const oThis = this
    ;
    return new Promise(function (onResolve) {
      Core.getInstance().createTable(oThis.createTableParams, function(err, data) {
        if (err) {
          logger.error(err);
          onResolve(responseHelper.errorWithData({error: err.stack}, "l_dy_ct_create_1", "Error in Creating table"));
        }
        else {
          logger.debug(data);
          onResolve(responseHelper.successWithData({data: data}));
        }
      });
    });

  }
};

module.exports = CreateTable;
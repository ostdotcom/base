"use strict";

/**
 * DynamoDB Create Table Library class
 *
 * @module lib/dynamodb/create_table
 *
 */

const rootPrefix  = "../.."
  , Core = require(rootPrefix+'config/core')
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
  , responseHelper = require(rootPrefix+'/lib/formatter/response')
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
   * @return {promise<result>}
   *
   */
  create: function () {
    const oThis = this
    ;
    return new Promise(function (onResolve, onReject) {
      Core.getInstance().createTable(oThis.createTableParams, function(err, data) {
        if (err) {
          onResolve(responseHelper.errorWithData({error: err.stack}, "l_dy_ct_create_1", "Error in Creating table"));
        }
        else {
          console.log(data);
          onResolve(responseHelper.successWithData({data: data}));
        }
      });
    });

  }

};

module.exports = CreateTable;
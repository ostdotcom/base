"use strict";

/**
 * DynamoDB Create Table service
 *
 * @module services/dynamodb/create_table
 *
 */

const rootPrefix  = "../.."
  , CreateTableKlass = require(rootPrefix+'/lib/dynamodb/create_table')
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
  perform: function () {
    const oThis = this
    ;

    try {

      var r = null;
      r = oThis.validateParams();
      logger.debug("=======CreateTable.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = new CreateTableKlass(oThis.params).perform();
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
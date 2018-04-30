"use strict";

/**
 * DynamoDB create table service
 *
 * @module services/dynamodb/create_table
 *
 */

const rootPrefix  = "../.."
  , base = require(rootPrefix + "/services/dynamodb/base")
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response')
  , responseHelper = new ResponseHelperKlass({module_name: "DDBCreateTableService"})
;


/**
 * Constructor for create table service class
 * @param params -
 *
 * @constructor
 */
const CreateTable = function(params, ddbObject) {
  const oThis = this
  ;
  base.call(this, 'createTable', params, ddbObject);
};

CreateTable.prototype = Object.create(base.prototype);

const createTablePrototype = {

  /**
   * Validation of params
   *
   * @return {<result>}
   *
   */
  validateParams: function () {

    const oThis = this
      ,validationResponse = base.validateParams.call(oThis)
    ;
    if (validationResponse.isFailure()) return validationResponse;

    return responseHelper.successWithData({});
  },

};

Object.assign(CreateTable.prototype, createTablePrototype);
CreateTable.prototype.constructor = CreateTable;

module.exports = CreateTable;
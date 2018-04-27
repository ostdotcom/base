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
    new CreateTableKlass(oThis.params).perform();
  }

};

module.exports = CreateTable;
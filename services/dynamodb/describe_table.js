"use strict";

/**
 * DynamoDB describe table service
 *
 * @module services/dynamodb/describe_table
 *
 */

const rootPrefix  = "../.."
  , base = require(rootPrefix + "/services/dynamodb/base")
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response')
  , responseHelper = new ResponseHelperKlass({module_name: "DDBDescribeTableService"})
;


/**
 * Constructor for describe table service class
 * @param params -
 *
 * @constructor
 */
const DescribeTable = function(params, ddbObject) {
  const oThis = this
  ;
  base.call(this, 'describeTable', params, ddbObject);
};

DescribeTable.prototype = Object.create(base.prototype);

const describeTablePrototype = {

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
Object.assign(DescribeTable.prototype, describeTablePrototype);
DescribeTable.prototype.constructor = DescribeTable;


module.exports = DescribeTable;
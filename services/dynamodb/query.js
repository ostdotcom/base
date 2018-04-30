"use strict";

/**
 * DynamoDB query service
 *
 * @module services/dynamodb/query
 *
 */

const rootPrefix  = "../.."
  , base = require(rootPrefix + "/services/dynamodb/base")
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response')
  , responseHelper = new ResponseHelperKlass({module_name: "DDBQueryService"})
;


/**
 * Constructor for describe table service class
 * @param params -
 *
 * @constructor
 */
const Query = function(params, ddbObject) {
  const oThis = this
  ;
  base.call(this, 'query', params, ddbObject);
};

Query.prototype = Object.create(base.prototype);

const queryPrototype = {

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

Object.assign(Query.prototype, queryPrototype);
Query.prototype.constructor = Query;

module.exports = Query;
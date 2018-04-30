"use strict";

/**
 * DynamoDB batch write
 *
 * @module services/dynamodb/batch_get
 *
 */

const rootPrefix  = "../.."
  , base = require(rootPrefix + "/services/dynamodb/base")
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response')
  , responseHelper = new ResponseHelperKlass({module_name: "DDBBatchWriteService"})
;


/**
 * Constructor for batch write service class
 * @param params -
 *
 * @constructor
 */
const BatchWrite = function(params, ddbObject) {
  const oThis = this
  ;
  base.call(this, 'batchWrite', params, ddbObject);
};

BatchWrite.prototype = Object.create(base.prototype);

const batchWritePrototype = {

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

Object.assign(BatchWrite.prototype, batchWritePrototype);
BatchWrite.prototype.constructor = BatchWrite;

module.exports = BatchWrite;
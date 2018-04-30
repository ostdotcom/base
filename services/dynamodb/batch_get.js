"use strict";

/**
 * DynamoDB batch get
 *
 * @module services/dynamodb/batch_get
 *
 */

const rootPrefix  = "../.."
  , base = require(rootPrefix + "/services/dynamodb/base")
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response')
  , responseHelper = new ResponseHelperKlass({module_name: "DDBBatchGetService"})
;


/**
 * Constructor for batch get service class
 * @param params -
 *
 * @constructor
 */
const BatchGet = function(params, ddbObject) {
  const oThis = this
  ;
  base.call(this, 'batchGet', params, ddbObject);
};

BatchGet.prototype = Object.create(base.prototype);


const batchGetPrototype = {

  /**
   * Validation of params
   *
   * @return {<result>}
   *
   */
  validateParams: function () {
    const oThis = this
      ,validationResponse = base.validateParams.call(oThis)
      , MINIMUM_KEYS = 3
    ;
    if (validationResponse.isFailure()) return validationResponse;

    if (Object.keys(oThis.params) > MINIMUM_KEYS ) {
      return responseHelper.error('l_dy_bg_validateParams_1', 'params have some mandatory keys missing');
    }

    return responseHelper.successWithData({});
  },
};

Object.assign(BatchGet.prototype, batchGetPrototype);
BatchGet.prototype.constructor = BatchGet;


module.exports = BatchGet;
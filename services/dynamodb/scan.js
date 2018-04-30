"use strict";

/**
 * DynamoDB scan service
 *
 * @module services/dynamodb/scan
 *
 */

const rootPrefix  = "../.."
  , base = require(rootPrefix + "/services/dynamodb/base")
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response')
  , responseHelper = new ResponseHelperKlass({module_name: "DDBScanService"})
;


/**
 * Constructor for scan service class
 * @param params -
 *
 * @constructor
 */
const Scan = function(params, ddbObject) {
  const oThis = this
  ;
  base.call(this, 'scan', params, ddbObject);
};

Scan.prototype = Object.create(base.prototype);

const scanPrototype = {

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

Object.assign(Scan.prototype, scanPrototype);
Scan.prototype.constructor = Scan;

module.exports = Scan;
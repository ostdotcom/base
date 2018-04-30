"use strict";

/**
 * DynamoDB update item service
 *
 * @module services/dynamodb/update_item
 *
 */

const rootPrefix  = "../.."
  , base = require(rootPrefix + "/services/dynamodb/base")
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response')
  , responseHelper = new ResponseHelperKlass({module_name: "DDBUpdateItemService"})
;


/**
 * Constructor for update item service class
 * @param params -
 *
 * @constructor
 */
const UpdateItem = function(params, ddbObject) {
  const oThis = this
  ;
  base.call(this, 'updateItem', params, ddbObject);
};

UpdateItem.prototype = Object.create(base.prototype);

const updateItemPrototype = {

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

Object.assign(UpdateItem.prototype, scanPrototype);
UpdateItem.prototype.constructor = updateItemPrototype;

module.exports = UpdateItem;
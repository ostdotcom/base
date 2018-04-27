"use strict";

/**
 * DynamoDB Update item service
 *
 * @module services/dynamodb/update_item
 *
 */

const rootPrefix  = "../.."
  , UpdateItemKlass = require(rootPrefix+'/services/dynamodb/update_item')
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
;

/**
 * Constructor for Update item service class
 *
 * @param params -
 *
 * @constructor
 */
const UpdateItem = function(params) {
  const oThis = this
  ;
  oThis.updateItemParams = params.update_item_params;
};

UpdateItem.prototype = {

  /**
   * Perform method
   *
   * @return {promise<result>}
   *
   */
  perform: async function () {
    const oThis = this
    ;

    try {

      var r = null;
      r = oThis.validateParams();
      logger.debug("=======UpdateItem.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await new UpdateItemKlass({update_item_params: oThis.updateItemParams}).perform();
      logger.debug("=======UpdateItem.perform.result=======");
      logger.debug(r);
    } catch (err) {
      return responseHelper.error('s_dy_ui_perform_1', 'Something went wrong. ' + err.message);
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
      , MINIMUM_KEYS = 3
    ;

    if (!oThis.updateItemParams) {
      return responseHelper.error('l_dy_ui_validateParams_1', 'Update Item params is mandatory');
    }

    if (Object.keys(oThis.updateItemParams) > MINIMUM_KEYS ) {
      return responseHelper.error('l_dy_ui_validateParams_2', 'Update Item params have some mandatory keys missing');
    }

    return responseHelper.successWithData({});
  },

};

module.exports = UpdateItem;
"use strict";

/**
 * DynamoDB Update Table Item Library class
 *
 * @module lib/dynamodb/update_item
 *
 */

const rootPrefix = "../.."
  , Core = require(rootPrefix+'config/core')
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
;

/**
 *
 * @constructor
 *
 * Constructor for update table item class
 *
 * @params {object} params -
 * @param {JSON} params.update_item_params - update item params
 */
// auto scale
const UpdateItem = function (params) {
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
    let r = null;
    r = await oThis.query();
    logger.debug("=======UpdateItem.update.result=======");
    logger.debug(r);
    return r;
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

  },

  /**
   * Run item update
   *
   * @return {Promise<any>}
   *
   */
  update: function () {
    const oThis = this
    ;
    return new Promise(function (onResolve) {
      Core.getInstance().updateItem(oThis.updateItemParams, function (err, data) {
        if (err) {
          onResolve(responseHelper.errorWithData({error: err.stack}, "l_dy_ui_update_1", "Error in updating item in table"));
        }
        else {
          logger.debug(data); // successful response
          onResolve(responseHelper.successWithData({data: data}));
        }
      });
    });
  }
};

module.exports = UpdateItem;
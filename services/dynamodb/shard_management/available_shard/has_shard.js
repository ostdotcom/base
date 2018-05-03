"use strict";

/**
 *
 * This class would be used to configure existing available shard.<br><br>
 *
 * @module services/dynamodb/shard_management/available_shard/has_shard
 *
 */

const rootPrefix = '../../../..'
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , availableShard = require( rootPrefix + '/lib/models/dynamodb/available_shard')
  , moduleName = 'services/dynamodb/shard_management/available_shard/has_shard'
  , responseHelper = new ResponseHelper({module_name: moduleName})
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()

;

/**
 * Constructor to create object of Configure Shard
 *
 * @constructor
 *
 * @params {object} params -
 * @param {string} params.ddb_object - dynamoDbObject
 * @param {string} params.shard_name - Name of the shard
 * @param {boolean} params.enable_allocation - to enable or disable allocation
 *
 * @return {Object}
 *
 */
const HasShard = function (params) {
  const oThis = this;
  params = params || {};
  logger.debug("=======HasShard.params=======");
  logger.debug(params);

  oThis.params = params;
  oThis.ddbObject = params.ddb_object;
  oThis.shardName = params.shard_name;
};

HasShard.prototype = {

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
      let r = null;

      r = await oThis.validateParams();
      logger.debug("=======HasShard.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await availableShard.hasShard(oThis.params);
      logger.debug("=======HasShard.hasShard.result=======");
      logger.debug(r);
      return r;
    } catch(err) {
      return responseHelper.error('s_sm_as_cs_perform_1', 'Something went wrong. ' + err.message);
    }

  },

  /**
   * Validation of params
   *
   * @return {Promise<any>}
   *
   */
  validateParams: function () {
    const oThis = this
    ;

    return new Promise(async function (onResolve) {

      if (!oThis.shardName) {
        logger.debug('s_sm_as_hs_validateParams_1', 'shardName is', oThis.shardName);
        return onResolve(responseHelper.error('s_sm_as_cs_validateParams_1', 'shardName is invalid'));
      }

      return onResolve(responseHelper.successWithData({}));
    });
  }
};

module.exports = HasShard;
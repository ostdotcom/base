"use strict";

/**
 *
 * This class would be used for getting available shards information.<br><br>
 *
 * @module services/shard_management/available_shard/get_shards
 *
 */

const rootPrefix = '../../..'
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , availableShard = require( rootPrefix + '/lib/models/dynamodb/available_shard')
  , moduleName = 'services/shard_management/available_shard/get_shards'
  , responseHelper = new ResponseHelper({module_name: moduleName})
  , availableShardGlobalConstant = require(rootPrefix + '/lib/global_constant/available_shard')
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
;

/**
 * Constructor to create object of Get Shard
 *
 * @constructor
 *
 * @params {object} params -
 * @param {string} params.shard_type - get shard type Example :- 'all', 'enabled', 'disabled' (Default 'All')
 * @param {JSON} params.table_schema - schema of the table in shard
 *
 * @return {Object}
 *
 */
const GetShards = function (params) {
  const oThis = this;
  logger.debug("=======GetShards.params=======");
  logger.debug(params);

  oThis.shardType = params.shard_type || 'all';
};

GetShards.prototype = {

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
      logger.debug("=======GetShards.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await availableShard.getShards();
      logger.debug("=======GetShards.addShard.result=======");
      logger.debug(r);
      return r;
    } catch(err) {
      return responseHelper.error('s_sm_as_gs_perform_1', 'Something went wrong. ' + err.message);
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

      if (!oThis.shardType || !(availableShardGlobalConstant.getShardTypes()[oThis.shardType]) ) {
        logger.debug('s_sm_as_gs_validateParams_1', 'shardType is', oThis.shardType);
        return onResolve(responseHelper.error('s_sm_as_gs_validateParams_1', 'shardType is invalid'));
      }

      return onResolve(responseHelper.successWithData({}));
    });
  }
};

module.exports = GetShards;
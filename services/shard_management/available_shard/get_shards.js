"use strict";

/**
 *
 * This class would be used for getting available shards information.<br><br>
 *
 * @module services/shard_management/available_shard/get_shards
 *
 */

const rootPrefix = '../../..'
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
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
const GetShardsKlass = function (params) {
  const oThis = this;
  params = params || {shard_type: 'all'};
  logger.debug("=======get_shards.params=======");
  logger.debug(params);

  oThis.shardType = params.shard_type;
};

GetShardsKlass.prototype = {

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
      logger.debug("=======get_shards.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await oThis.getShards();
      logger.debug("=======get_shards.addShard.result=======");
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

      if (!oThis.shardType || !(oThis.shardType === 'all' || oThis.shardType === 'enabled' || oThis.shardType === 'disabled')) {
        logger.debug('s_sm_as_gs_validateParams_1', 'shardType is', oThis.shardType);
        return onResolve(responseHelper.error('s_sm_as_gs_validateParams_1', 'shardType is invalid'));
      }

      return onResolve(responseHelper.successWithData({}));
    });
  },

  /**
   * Run add shard
   *
   * @return {Promise<any>}
   *
   */
  getShards: function () {
    const oThis = this
    ;

    return new Promise(async function (onResolve) {
      try {
        // Todo:: Get shards based on params
        return onResolve(responseHelper.successWithData({}));
      } catch (err) {
        return onResolve(responseHelper.error('s_sm_as_gs_getShards_1', 'Error getting shards. ' + err));
      }
    });
  }
};

module.exports = GetShardsKlass;
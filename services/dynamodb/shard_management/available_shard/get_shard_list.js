"use strict";

/**
 *
 * This class would be used for getting available shards information.<br><br>
 *
 * @module services/shard_management/available_shard/get_shards
 *
 */

const rootPrefix = '../../../..'
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , coreConstants = require(rootPrefix + "/config/core_constants")
  , availableShardGlobalConstant = require(rootPrefix + '/lib/global_constant/available_shard')
  , managedShardConst = require(rootPrefix + '/lib/global_constant/managed_shard')
  , GetShardListMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/get_shard_list')
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
;

/**
 * Constructor to create object of Get Shard List
 *
 * @constructor
 *
 * @params {object} params -
 * @param {object} params.ddb_object - Dynamo db object
 * @param {string} params.entity_type - entity type
 * @param {string} params.shard_type - get shard type Example :- 'all', 'enabled', 'disabled' (Default 'All')
 * @param {JSON} params.table_schema - schema of the table in shard
 *
 * @return {Object}
 *
 */
const GetShardList = function (params) {
  const oThis = this;
  logger.debug("=======GetShardList.params=======");
  logger.debug(params);

  oThis.params = params;
  oThis.ddbObject = params.ddb_object;
  oThis.entityType = params.entity_type;
  oThis.shardType = params.shard_type || availableShardGlobalConstant.all;
};

GetShardList.prototype = {

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
      logger.debug("=======GetShardList.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await oThis.getShardListFromCache();

      return r;
    } catch(err) {
      return responseHelper.error({
        internal_error_identifier:"s_sm_as_gsl_perform_1",
        api_error_identifier: "exception",
        debug_options: {error: err},
        error_config: coreConstants.ERROR_CONFIG
      });
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

      if (!(managedShardConst.getSupportedEntityTypes()[oThis.entityType])) {
        logger.debug('s_sm_as_gsl_validateParams_1', 'entityType is', oThis.entityType);
        return onResolve(responseHelper.paramValidationError({
          internal_error_identifier: "s_sm_as_gsl_validateParams_1",
          api_error_identifier: "invalid_api_params",
          params_error_identifiers: ["invalid_entity_type"],
          debug_options: {},
          error_config: coreConstants.ERROR_CONFIG
        }));
      }

      if (!oThis.shardType || (availableShardGlobalConstant.getShardTypes()[oThis.shardType] === undefined) ) {
        logger.debug('s_sm_as_gsl_validateParams_2', 'shardType is', oThis.shardType);
        return onResolve(responseHelper.paramValidationError({
          internal_error_identifier: "s_sm_as_gsl_validateParams_2",
          api_error_identifier: "invalid_api_params",
          params_error_identifiers: ["invalid_shard_type"],
          debug_options: {},
          error_config: coreConstants.ERROR_CONFIG
        }));
      }

      return onResolve(responseHelper.successWithData({}));
    });
  },

  /**
   * To get shard List from cache
   * @return {Promise<*|Object<Result>>}
   */
  getShardListFromCache : async function () {
    const oThis = this
      , cacheParams = {
      ddb_object: oThis.ddbObject,
      ids: [{entity_type: oThis.entityType, shard_type: oThis.shardType}]
    };
    let r = await new GetShardListMultiCacheKlass(cacheParams).fetch();
    logger.debug("=======GetShardList.addShard.result=======");
    logger.debug(r);
    if (r.isSuccess()) {
      return responseHelper.successWithData({data: r.data[String(oThis.entityType + oThis.shardType)]});
    } else {
      return responseHelper;
    }
  }
};

module.exports = GetShardList;
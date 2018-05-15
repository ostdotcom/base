"use strict";

/**
 *
 * This class would be used to assign shard based on id.<br><br>
 *
 * @module services/shard_management/managed_shard/assign_shard
 *
 */

const rootPrefix = '../../../..'
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response_helper')
  , managedShard = require(rootPrefix + '/lib/models/dynamodb/managed_shard')
  , managedShardConst = require(rootPrefix + '/lib/global_constant/managed_shard')
  , GetShardNameMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/get_shard_details')
  , HasShardMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/has_shard')
  , availableShard = require(rootPrefix + '/lib/models/dynamodb/available_shard')
  , availableShardConst = require(rootPrefix + "/lib/global_constant/available_shard")
  , moduleName = 'services/shard_management/managed_shard/assign_shard'
  , responseHelper = require(rootPrefix + '/lib/response')
  , coreConstants = require(rootPrefix + "/config/core_constants")
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
;

/**
 * Constructor to create object of Assign Shard
 *
 * @constructor
 *
 * @params {object} params -
 * @param {object} params.ddb_object - dynamo db object
 * @param {string} params.identifier - identifier of the shard
 * @param {string} params.entity_type - schema of the table in shard
 * @param {string} params.shard_name - shard name
 * @param {bool} params.force_assignment - true/false
 *
 * @return {Object}
 *
 */
const AssignShard = function (params) {
  const oThis = this;
  logger.debug("=======AssignShard.params=======");
  logger.debug(params);
  oThis.params = params;
  oThis.ddbObject = params.ddb_object;
  oThis.identifier = params.identifier;
  oThis.entityType = params.entity_type;
  oThis.shardName = params.shard_name;
  oThis.forceAssignment = params.force_assignment;
};

AssignShard.prototype = {

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
      logger.debug("=======AssignShard.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await managedShard.assignShard(oThis.params);
      logger.debug("=======AssignShard.addShard.result=======");
      logger.debug(r);

      oThis.clearAnyAssociatedCache();

      return r;
    } catch (err) {
      return responseHelper.error({
        internal_error_identifier: "s_sm_as_as_perform_1",
        api_error_identifier: "exception",
        debug_options: {message: err.message},
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
      , errorCodePrefix = 's_sm_ms_as_validateParams_'
    ;

    return new Promise(async function (onResolve) {
      let errorCode = null
        , errorMsg = null
      ;

      oThis.hasShard = async function () {
        const oThis = this
          , paramsHasShard = {
          ddb_object: oThis.ddbObject,
          shard_names: [oThis.shardName]
        };
        const response = await (new HasShardMultiCacheKlass(paramsHasShard)).fetch();
        if (response.isFailure()) {
          return false;
        }

        return response.data[oThis.shardName].has_shard
      };

      oThis.isAllocatedShard = async function () {
        const oThis = this
          , responseShardInfo = await availableShard.getShardByName(oThis.params)
          , shardInfo = responseShardInfo.data[oThis.shardName]
        ;

        if (responseShardInfo.isFailure() || !shardInfo) {
          throw "assign shard :: validateParams :: getShardByName function failed OR ShardInfo not present"
        }

        let allocationType = shardInfo[String(availableShardConst.ALLOCATION_TYPE)];
        return allocationType === availableShardConst.enabled;
      };
      let params_error_identifier = null;
      if (!oThis.identifier) {
        errorCode = errorCodePrefix + '1';
        params_error_identifier = "invalid_shard_identifier";
      } else if (!(managedShardConst.getSupportedEntityTypes()[oThis.entityType])) {
        errorCode = errorCodePrefix + '2';
        params_error_identifier = "invalid_entity_type";
      } else if (!oThis.ddbObject) {
        errorCode = errorCodePrefix + '3';
        params_error_identifier = "ddb_object_missing";
      } else if (!(await oThis.hasShard())) {
        errorCode = errorCodePrefix + '4';
        params_error_identifier = "invalid_shard_name";
      } else if (!oThis.forceAssignment && (await oThis.isAllocatedShard())) {
        errorCode = errorCodePrefix + '5';
        params_error_identifier = "invalid_force_allocation";
      } else {
        return onResolve(responseHelper.successWithData({}));
      }

      logger.debug(errorCode, params_error_identifier);
      return onResolve(responseHelper.paramValidationError({
        internal_error_identifier: errorCode,
        api_error_identifier: "invalid_api_params",
        params_error_identifiers: [params_error_identifier],
        debug_options: {},
        error_config: coreConstants.ERROR_CONFIG
      }));
    });
  },

  /**
   * Clear affected cache
   * @return {Promise<*>}
   */
  clearAnyAssociatedCache: async function () {
    const oThis = this
      , cacheParamsGetShard = {
      ddb_object: oThis.ddbObject,
      ids: [{identifier: oThis.identifier, entity_type: oThis.entityType}]
    };
    return await new GetShardNameMultiCacheKlass(cacheParamsGetShard).clear();
  }
};

module.exports = AssignShard;
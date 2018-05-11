"use strict";

/**
 *
 * This class would be used to assign shard based on id.<br><br>
 *
 * @module services/shard_management/managed_shard/assign_shard
 *
 */

const rootPrefix = '../../../..'
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , managedShard = require(rootPrefix + '/lib/models/dynamodb/managed_shard')
  , managedShardConst = require(rootPrefix + '/lib/global_constant/managed_shard')
  , GetShardNameMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/get_shard_name')
  , HasShardMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/has_shard')
  , availableShard = require( rootPrefix + '/lib/models/dynamodb/available_shard')
  , availableShardConst = require(rootPrefix + "/lib/global_constant/available_shard")
  , moduleName = 'services/shard_management/managed_shard/assign_shard'
  , responseHelper = new ResponseHelper({module_name: moduleName})
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
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
    } catch(err) {
      return responseHelper.error('s_sm_as_as_perform_1', 'Something went wrong. ' + err.message);
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

      oThis.hasShard = async function() {
        const oThis = this
          , paramsHasShard = {
          ddb_object: oThis.ddbObject,
          shard_names: [oThis.shardName]
        };
        const response  = await (new HasShardMultiCacheKlass(paramsHasShard)).fetch();
        if (response.isFailure()){
          return false;
        }

        return response.data[oThis.shardName].has_shard
      };

      oThis.isAllocatedShard = async function() {
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

      if (!oThis.identifier) {
        errorCode = errorCodePrefix + '1';
        errorMsg = 'identifier is undefined';
      } else if (!(managedShardConst.getSupportedEntityTypes()[oThis.entityType])) {
        errorCode = errorCodePrefix + '2';
        errorMsg = 'entityType is not supported';
      } else if (!oThis.ddbObject) {
        errorCode = errorCodePrefix + '3';
        errorMsg = 'ddbObject is undefined';
      } else if (!(await oThis.hasShard())) {
        errorCode = errorCodePrefix + '4';
        errorMsg = 'shardName does not exists';
      } else if (!oThis.forceAssignment && (await oThis.isAllocatedShard())) {
          errorCode = errorCodePrefix + '5';
          errorMsg = 'Shard is not available for assignment other force assignment';
      } else {
        return onResolve(responseHelper.successWithData({}));
      }

      logger.debug(errorCode, errorMsg);
      return onResolve(responseHelper.error(errorCode, errorMsg));
    });
  },

  /**
   * Clear affected cache
   * @return {Promise<*>}
   */
  clearAnyAssociatedCache: async function() {
    const oThis = this
      , cacheParamsGetShard = {
      ddb_object: oThis.ddbObject,
      ids: [{identifier: oThis.identifier, entity_type: oThis.entityType}]
    };
    return await new GetShardNameMultiCacheKlass(cacheParamsGetShard).clear();
  }
};

module.exports = AssignShard;
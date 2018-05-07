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
  , GetShardMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/get_managed_shard')
  , HasShardMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/has_shard')
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

      /******************** Cache clearance *********************/
      const cacheParamsHasShard = {
        ddb_object: oThis.ddbObject,
        shard_names: [oThis.shardName]
      };
      new HasShardMultiCacheKlass(cacheParamsHasShard).clear();

      const cacheParamsGetShard = {
        ddb_object: oThis.ddbObject,
        ids: [{identifier: oThis.identifier, entity_type: oThis.entityType}]
      };
      new GetShardMultiCacheKlass(cacheParamsGetShard).clear();

      /******************** Cache clearance *********************/

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
    ;

    return new Promise(async function (onResolve) {

      if (!oThis.identifier) {
        logger.debug('s_sm_ms_as_validateParams_1', 'identifier is', oThis.identifier);
        return onResolve(responseHelper.error('s_sm_as_as_validateParams_1', 'identifier is undefined'));
      }

      if (!(managedShardConst.getSupportedEntityTypes()[oThis.entityType])) {
        logger.debug('s_sm_ms_as_validateParams_2', 'entityType is', oThis.entityType);
        return onResolve(responseHelper.error('s_sm_as_as_validateParams_2', 'entityType is not supported'));
      }

      if (!oThis.ddbObject) {
        logger.debug('s_sm_ms_as_validateParams_3', 'ddbObject is', oThis.ddbObject);
        return onResolve(responseHelper.error('s_sm_as_as_validateParams_1', 'ddbObject is undefined'));
      }

      const response = await oThis.ddbObject.shardManagement().hasShard({ddb_object: oThis.ddbObject, shard_names: [oThis.shardName]});
      if (response.isFailure() || !response.data[oThis.shardName].has_shard) {
        logger.debug('s_sm_ms_as_validateParams_4', 'shardName does not exists', oThis.shardName);
        return onResolve(responseHelper.error('s_sm_ms_as_validateParams_1', 'shardName does not exists'));
      }

      return onResolve(responseHelper.successWithData({}));
    });
  }
};

module.exports = AssignShard;
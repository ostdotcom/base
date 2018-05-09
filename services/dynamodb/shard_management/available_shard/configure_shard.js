"use strict";

/**
 *
 * This class would be used to configure existing available shard.<br><br>
 *
 * @module services/shard_management/available_shard/configure_shard
 *
 */

const rootPrefix = '../../../..'
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , availableShard = require( rootPrefix + '/lib/models/dynamodb/available_shard')
  , GetShardListMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/get_shard_list')
  , availableShardConst = require(rootPrefix + "/lib/global_constant/available_shard")
  , HasShardMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/has_shard')
  , moduleName = 'services/shard_management/available_shard/configure_shard'
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
const ConfigureShard = function (params) {
  const oThis = this;
  params = params || {};
  logger.debug("=======ConfigureShard.params=======");
  logger.debug(params);

  oThis.params = params;
  oThis.ddbObject = params.ddb_object;
  oThis.shardName = params.shard_name;
  oThis.enableAllocation = params.enable_allocation;
};

ConfigureShard.prototype = {

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
      logger.debug("=======ConfigureShard.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await availableShard.configureShard(oThis.params);
      logger.debug("=======ConfigureShard.configureShard.result=======");
      logger.debug(r);


      /******************** Cache clearance *********************/
      logger.debug("=======ConfigureShard.cacheClearance.result=======");

      let response = await availableShard.getShardInfo(oThis.params);
      logger.log("DEBUG", response);
      if (response.isFailure()) return responseHelper.error('s_sm_as_cs_perform_1', 'Something went wrong. ' + response.msg);

      const entity_type = response.data[oThis.shardName][availableShardConst.ENTITY_TYPE];
      let allocation_type = response.data[oThis.shardName][String(availableShardConst.ALLOCATION_TYPE)];
      allocation_type = availableShardConst.disabled === availableShardConst.getShardTypes()[allocation_type] ? availableShardConst.enabled : availableShardConst.disabled;

      const cacheParams = {
        ddb_object: oThis.ddbObject,
        ids: [{entity_type: entity_type, shard_type: allocation_type}]
      };
      new GetShardListMultiCacheKlass(cacheParams).clear();

      /******************** Cache clearance *********************/

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
        logger.debug('s_sm_as_cs_validateParams_1', 'shardName is', oThis.shardName);
        return onResolve(responseHelper.error('s_sm_as_cs_validateParams_1', 'shardName is invalid'));
      }

      if (typeof(oThis.enableAllocation) !== 'number') {
        logger.debug('s_sm_as_cs__validateParams_2', 'enableAllocation is', oThis.enableAllocation);
        return onResolve(responseHelper.error('s_sm_as_cs__validateParams_2', 'enableAllocation is invalid'));
      }

      const paramsHasShard = {
        ddb_object: oThis.ddbObject,
        shard_names: [oThis.shardName]
      };
      const response = await (new HasShardMultiCacheKlass(paramsHasShard)).fetch();

      if (response.isFailure() || !response.data[oThis.shardName].has_shard) {
        logger.debug('s_sm_as_cs__validateParams_3', 'shardName does not exists', oThis.shardName);
        return onResolve(responseHelper.error('s_sm_as_cs__validateParams_3', 'shardName does not exists'));
      }

      return onResolve(responseHelper.successWithData({}));
    });
  }
};

module.exports = ConfigureShard;
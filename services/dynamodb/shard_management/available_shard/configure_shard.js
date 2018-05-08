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
  logger.debug("=======addShard.params=======");
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


      // const cacheParams = {
      //   ddb_object: oThis.ddbObject,
      //   ids: [{entity_type: oThis.entityType, shard_type: oThis.shardType}]
      // };
      // r = await new GetShardsMultiCacheKlass(cacheParams).clear();
      //TODO ::  How to clear cache of getShards

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

      return onResolve(responseHelper.successWithData({}));
    });
  }
};

module.exports = ConfigureShard;
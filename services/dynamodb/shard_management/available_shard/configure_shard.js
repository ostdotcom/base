"use strict";

/**
 *
 * This class would be used to configure existing available shard.<br><br>
 *
 * @module services/shard_management/available_shard/configure_shard
 *
 */

const rootPrefix = '../../../..'
  , responseHelper = require(rootPrefix + '/lib/response')
  , coreConstants = require(rootPrefix + "/config/core_constants")
  , availableShard = require( rootPrefix + '/lib/models/dynamodb/available_shard')
  , GetShardListMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/get_shard_list')
  , availableShardConst = require(rootPrefix + "/lib/global_constant/available_shard")
  , HasShardMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/has_shard')
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
 * @param {string} params.allocation_type - enable or disable allocation. enabled/disabled
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
  oThis.allocationType = params.allocation_type;
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

      if ((await oThis.isRedundantUpdate())) {
        return responseHelper.successWithData({});
      } else {
        r = await availableShard.configureShard(oThis.params);
        logger.debug("=======ConfigureShard.configureShard.result=======");
        logger.debug(r);

        oThis.clearAnyAssociatedCache();
      }

      return r;
    } catch(err) {
      return responseHelper.error({
        internal_error_identifier:"s_sm_as_cs_perform_1",
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
      , errorCodePrefix = 's_sm_as_cs_validateParams_'
    ;

    return new Promise(async function (onResolve) {
      let errorCode = null
        , errorMsg = null
        , params_error_identifier = null
      ;

      oThis.hasShard = async function() {
        const paramsHasShard = {
          ddb_object: oThis.ddbObject,
          shard_names: [oThis.shardName]
        };
        const response  = await (new HasShardMultiCacheKlass(paramsHasShard)).fetch();
        if (response.isFailure()){
          return false;
        }

        return response.data[oThis.shardName].has_shard
      };

      if (!oThis.shardName) {
        errorCode = errorCodePrefix + '1';
        params_error_identifier = "shard_name_mandatory";
      } else if (String(typeof(oThis.allocationType)) !== 'string') {
        errorCode = errorCodePrefix + '2';
        params_error_identifier = "invalid_allocation_type";
      } else if (undefined === availableShardConst.ALLOCATION_TYPES[oThis.allocationType]) {
        errorCode = errorCodePrefix + '3';
        params_error_identifier = "invalid_allocation_type";
      } else if (!(await oThis.hasShard())) {
        errorCode = errorCodePrefix + '4';
        errorMsg = 'shardName does not exists';
        params_error_identifier = "invalid_shard_name";
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

  isRedundantUpdate : async function() {
    const oThis = this
      , responseShardInfo = await availableShard.getShardByName(oThis.params)
      , shardInfo = responseShardInfo.data[oThis.shardName]
    ;

    if (responseShardInfo.isFailure() || !shardInfo) {
      throw "configure_shard :: validateParams :: getShardByName function failed OR ShardInfo not present"
    }

    oThis.oldEntityType = shardInfo[availableShardConst.ENTITY_TYPE];
    oThis.oldAllocationType = shardInfo[String(availableShardConst.ALLOCATION_TYPE)];

    return oThis.oldAllocationType === oThis.allocationType;
  },

  clearAnyAssociatedCache: async function() {
    const oThis = this
    ;

    logger.debug("=======ConfigureShard.cacheClearance.result=======");
    const cacheParams = {
      ddb_object: oThis.ddbObject,
      ids: [{
        entity_type: oThis.oldEntityType,
        shard_type: oThis.allocationType}, {
        entity_type: oThis.oldEntityType,
        shard_type: oThis.oldAllocationType
      }]
    };

    return new GetShardListMultiCacheKlass(cacheParams).clear();
  }
};

module.exports = ConfigureShard;
"use strict";

const rootPrefix = '../..'
  , baseCache = require(rootPrefix + '/services/cache_multi_management/base')
  , managedShard = require(rootPrefix + '/lib/models/dynamodb/managed_shard')
  , responseHelper = require(rootPrefix + '/lib/response')
  , coreConstants = require(rootPrefix + "/config/core_constants")
  , moduleName = 'services/cache_multi_management/get_shard_details'
;

/**
 * @constructor
 * @augments GetShardDetailsCacheKlass
 *
 * @param {Object} params - cache key generation & expiry related params
 *
 */
const GetShardDetailsCacheKlass = module.exports = function (params) {

  const oThis = this;
  oThis.params = params;
  oThis.identifiers = params.identifiers;
  oThis.entityType = params.entityType;

  baseCache.call(this, oThis.params);
};

GetShardDetailsCacheKlass.prototype = Object.create(baseCache.prototype);

GetShardDetailsCacheKlass.prototype.constructor = GetShardDetailsCacheKlass;

/**
 * set cache key
 *
 * @return {Object}
 */
GetShardDetailsCacheKlass.prototype.setCacheKeys = function () {
  const oThis = this
  ;

  oThis.cacheKeys = {};
  for (let i = 0; i < oThis.identifiers.length; i++) {
    oThis.cacheKeys[oThis._cacheKeyPrefix() + "dy_sm_gsd_" + '_et_' + oThis.identifiers[i].entity_type + '_id_' + oThis.identifiers[i]] = oThis.identifiers[i];
  }

  return oThis.cacheKeys;
};


/**
 * set cache expiry in oThis.cacheExpiry and return it
 *
 * @return {Number}
 */
GetShardDetailsCacheKlass.prototype.setCacheExpiry = function () {

  const oThis = this;

  oThis.cacheExpiry = 86400; // 24 hours ;

  return oThis.cacheExpiry;

};

/**
 * fetch data from source
 *
 * @return {Result}
 */
GetShardDetailsCacheKlass.prototype.fetchDataFromSource = async function (cacheIds) {

  const oThis = this;

  if (!cacheIds) {
    
    return responseHelper.paramValidationError({
      internal_error_identifier:"s_cmm_gsd_1",
      api_error_identifier: "invalid_api_params",
      params_error_identifiers: ["blank_ids"],
      debug_options: {},
      error_config: coreConstants.ERROR_CONFIG
    })
  }

  return await managedShard.getShard(Object.assign({}, oThis.params, {
    identifiers: cacheIds,
  }));
};
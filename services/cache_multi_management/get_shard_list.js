"use strict";

const rootPrefix = '../..'
  , baseCache = require(rootPrefix + '/services/cache_multi_management/base')
  , availableShard = require(rootPrefix + '/lib/models/dynamodb/available_shard')
  , responseHelper = require(rootPrefix + '/lib/response')
  , moduleName = 'services/cache_multi_management/get_shard_list'
;

/**
 * @constructor
 *
 * @augments GetShardListCacheKlass
 *
 * @param {Object} params - cache key generation & expiry related params
 *
 */
const GetShardListCacheKlass = module.exports = function (params) {

  const oThis = this;
  oThis.params = params;
  oThis.identifiers = params.ids;
  oThis.idToValueMap = {};

  baseCache.call(this, oThis.params);
};

GetShardListCacheKlass.prototype = Object.create(baseCache.prototype);

GetShardListCacheKlass.prototype.constructor = GetShardListCacheKlass;

/**
 * set cache key
 *
 * @return {Object}
 */
GetShardListCacheKlass.prototype.setCacheKeys = function () {

  const oThis = this;

  oThis.cacheKeys = {};
  for (let i = 0; i < oThis.identifiers.length; i++) {
    let key = String(oThis.identifiers[i].entity_type + oThis.identifiers[i].shard_type);
    oThis.cacheKeys[oThis._cacheKeyPrefix() + "dy_sm_gsl_" + "et_" + oThis.identifiers[i].entity_type + "st_" + oThis.identifiers[i].shard_type] = key;
    oThis.idToValueMap[key] = oThis.identifiers[i];
  }

  return oThis.cacheKeys;

};

/**
 * set cache expiry in oThis.cacheExpiry and return it
 *
 * @return {Number}
 */
GetShardListCacheKlass.prototype.setCacheExpiry = function () {

  const oThis = this;

  oThis.cacheExpiry = 86400; // 24 hours ;

  return oThis.cacheExpiry;

};

/**
 * fetch data from source
 *
 * @return {Result}
 */
GetShardListCacheKlass.prototype.fetchDataFromSource = async function (cacheIds) {

  const oThis = this;

  if (!cacheIds) {

    return responseHelper.paramValidationError({
      internal_error_identifier: "s_cmm_gsl_1",
      api_error_identifier: "invalid_api_params",
      params_error_identifiers: ["blank ids"],
      debug_options: {},
      error_config: coreConstants.ERROR_CONFIG
    });
  }

  return await availableShard.getShardsByEntityAllocation(Object.assign({}, oThis.params, {
    ids: cacheIds,
    id_value_map: oThis.idToValueMap
  }));
};
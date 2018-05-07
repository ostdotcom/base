"use strict";

const rootPrefix = '../..'
  , baseCache = require(rootPrefix + '/services/cache_multi_management/base')
  , managedShard = require(rootPrefix + '/lib/models/dynamodb/managed_shard')
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , moduleName = 'services/cache_multi_management/get_managed_shard'
  , responseHelper = new ResponseHelper({module_name: moduleName})
;

/**
 * @constructor
 * @augments GetShardCacheKlass
 *
 * @param {Object} params - cache key generation & expiry related params
 *
 */
const GetShardCacheKlass = module.exports = function (params) {

  const oThis = this;
  oThis.params = params;
  oThis.ids = params.ids;
  oThis.idToValueMap = {};

  baseCache.call(this, oThis.params);
};

GetShardCacheKlass.prototype = Object.create(baseCache.prototype);

GetShardCacheKlass.prototype.constructor = GetShardCacheKlass;

/**
 * set cache key
 *
 * @return {Object}
 */
GetShardCacheKlass.prototype.setCacheKeys = function () {

  const oThis = this;

  oThis.cacheKeys = {};
  for (let i = 0; i < oThis.ids.length; i++) {
    let key = String(oThis.ids[i].identifier + oThis.ids[i].entity_type);
    oThis.cacheKeys[oThis._cacheKeyPrefix() + "dy_sm_gms_" + oThis.ids[i].identifier + '_et_' + oThis.ids[i].entity_type] = key;
    oThis.idToValueMap[key] = oThis.ids[i];
  }

  return oThis.cacheKeys;

};

/**
 * set cache expiry in oThis.cacheExpiry and return it
 *
 * @return {Number}
 */
GetShardCacheKlass.prototype.setCacheExpiry = function () {

  const oThis = this;

  oThis.cacheExpiry = 86400; // 24 hours ;

  return oThis.cacheExpiry;

};

/**
 * fetch data from source
 *
 * @return {Result}
 */
GetShardCacheKlass.prototype.fetchDataFromSource = async function (cacheIds) {

  const oThis = this;

  if (!cacheIds) {
    return responseHelper.error(
      'dy_sm_gs_1', 'blank ids'
    );
  }

  return await managedShard.getShard(Object.assign({}, oThis.params, {
    ids: cacheIds,
    id_value_map: oThis.idToValueMap
  }));
};
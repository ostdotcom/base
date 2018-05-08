"use strict";

const rootPrefix = '../..'
  , baseCache = require(rootPrefix + '/services/cache_multi_management/base')
  , managedShard = require(rootPrefix + '/lib/models/dynamodb/managed_shard')
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , moduleName = 'services/cache_multi_management/get_shard_name'
  , responseHelper = new ResponseHelper({module_name: moduleName})
;

/**
 * @constructor
 * @augments GetShardNameCacheKlass
 *
 * @param {Object} params - cache key generation & expiry related params
 *
 */
const GetShardNameCacheKlass = module.exports = function (params) {

  const oThis = this;
  oThis.params = params;
  oThis.ids = params.ids;
  oThis.idToValueMap = {};

  baseCache.call(this, oThis.params);
};

GetShardNameCacheKlass.prototype = Object.create(baseCache.prototype);

GetShardNameCacheKlass.prototype.constructor = GetShardNameCacheKlass;

/**
 * set cache key
 *
 * @return {Object}
 */
GetShardNameCacheKlass.prototype.setCacheKeys = function () {

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
GetShardNameCacheKlass.prototype.setCacheExpiry = function () {

  const oThis = this;

  oThis.cacheExpiry = 86400; // 24 hours ;

  return oThis.cacheExpiry;

};

/**
 * fetch data from source
 *
 * @return {Result}
 */
GetShardNameCacheKlass.prototype.fetchDataFromSource = async function (cacheIds) {

  const oThis = this;

  if (!cacheIds) {
    return responseHelper.error(
      's_cmm_gsn_1', 'blank ids'
    );
  }

  return await managedShard.getShard(Object.assign({}, oThis.params, {
    ids: cacheIds,
    id_value_map: oThis.idToValueMap
  }));
};
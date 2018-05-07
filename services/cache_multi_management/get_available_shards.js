"use strict";

const rootPrefix = '../..'
  , baseCache = require(rootPrefix + '/services/cache_multi_management/base')
  , availableShard = require( rootPrefix + '/lib/models/dynamodb/available_shard')
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , moduleName = 'services/cache_multi_management/get_available_shards'
  , responseHelper = new ResponseHelper({module_name: moduleName})
;

/**
 * @constructor
 * @augments GetShardsCacheKlass
 *
 * @param {Object} params - cache key generation & expiry related params
 *
 */
const GetShardsCacheKlass = module.exports = function (params) {

  const oThis = this;
  oThis.params = params;
  oThis.ids = params.ids;
  oThis.idToValueMap = {};

  baseCache.call(this, oThis.params);
};

GetShardsCacheKlass.prototype = Object.create(baseCache.prototype);

GetShardsCacheKlass.prototype.constructor = GetShardsCacheKlass;

/**
 * set cache key
 *
 * @return {Object}
 */
GetShardsCacheKlass.prototype.setCacheKeys = function () {

  const oThis = this;

  oThis.cacheKeys = {};
  for (let i = 0; i < oThis.ids.length; i++) {
    let key = String(oThis.ids[i].entity_type + oThis.ids[i].shard_type);
    oThis.cacheKeys[oThis._cacheKeyPrefix() + "dy_sm_gas_" + "et_" + oThis.ids[i].entity_type +"st_" + oThis.ids[i].shard_type] = key;
    oThis.idToValueMap[key] = oThis.ids[i];
  }

  return oThis.cacheKeys;

};

/**
 * set cache expiry in oThis.cacheExpiry and return it
 *
 * @return {Number}
 */
GetShardsCacheKlass.prototype.setCacheExpiry = function () {

  const oThis = this;

  oThis.cacheExpiry = 86400; // 24 hours ;

  return oThis.cacheExpiry;

};

/**
 * fetch data from source
 *
 * @return {Result}
 */
GetShardsCacheKlass.prototype.fetchDataFromSource = async function (cacheIds) {

  const oThis = this;

  if (!cacheIds) {
    return responseHelper.error(
      'dy_sm_gs_1', 'blank ids'
    );
  }

  return await availableShard.getShards(Object.assign({}, oThis.params, {
    ids: cacheIds,
    id_value_map: oThis.idToValueMap
  }));
};
"use strict";

const rootPrefix = '../..'
  , baseCache = require(rootPrefix + '/services/cache_multi_management/base')
  , availableShard = require( rootPrefix + '/lib/models/dynamodb/available_shard')
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , moduleName = 'services/cache_multi_management/has_shard'
  , responseHelper = new ResponseHelper({module_name: moduleName})
;

/**
 * @constructor
 * @augments HasShardKlass
 *
 * @param {Object} params - cache key generation & expiry related params
 *
 */
const HasShardKlass = module.exports = function (params) {

  const oThis = this;
  oThis.params = params;
  oThis.shardNames = params.shard_names;

  baseCache.call(this, oThis.params);
};

HasShardKlass.prototype = Object.create(baseCache.prototype);

HasShardKlass.prototype.constructor = HasShardKlass;

/**
 * set cache key
 *
 * @return {Object}
 */
HasShardKlass.prototype.setCacheKeys = function () {

  const oThis = this;

  oThis.cacheKeys = {};
  for (let i = 0; i < oThis.shardNames.length; i++) {
    oThis.cacheKeys[oThis._cacheKeyPrefix() + "dy_sm_hs_" + oThis.shardNames[i]] = oThis.shardNames[i];
  }

  return oThis.cacheKeys;

};

/**
 * set cache expiry in oThis.cacheExpiry and return it
 *
 * @return {Number}
 */
HasShardKlass.prototype.setCacheExpiry = function () {

  const oThis = this;

  oThis.cacheExpiry = 86400; // 24 hours ;

  return oThis.cacheExpiry;

};

/**
 * fetch data from source
 *
 * @return {Result}
 */
HasShardKlass.prototype.fetchDataFromSource = async function (cacheIds) {

  const oThis = this;

  if (!cacheIds) {
    return responseHelper.error(
      'dy_sm_gs_1', 'blank ids'
    );
  }

  return await availableShard.hasShard(Object.assign({}, oThis.params, {
    shard_names: cacheIds
  }));
};
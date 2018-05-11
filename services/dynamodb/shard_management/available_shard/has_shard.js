"use strict";

/**
 *
 * This class would be used to configure existing available shard.<br><br>
 *
 * @module services/dynamodb/shard_management/available_shard/has_shard
 *
 */

const rootPrefix = '../../../..'
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , HasShardMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/has_shard')
  , moduleName = 'services/dynamodb/shard_management/available_shard/has_shard'
  , responseHelper = new ResponseHelper({module_name: moduleName})
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
;

/**
 * Constructor to create object of Has Shard class
 *
 * @constructor
 *
 * @params {object} params -
 * @param {string} params.ddb_object - dynamoDbObject
 * @param {string} params.shard_names - Name of the shard
 * @param {boolean} params.enable_allocation - to enable or disable allocation
 *
 * @return {Object}
 *
 */
const HasShard = function (params) {
  const oThis = this;
  params = params || {};
  logger.debug("=======HasShard.params=======");
  logger.debug(params);

  oThis.params = params;
  oThis.ddbObject = params.ddb_object;
  oThis.shardNames = params.shard_names;
};

HasShard.prototype = {

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
      logger.debug("=======HasShard.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await oThis.hasShardFromCache();
      return r;
    } catch(err) {
      return responseHelper.error('s_sm_as_hs_perform_1', 'Something went wrong. ' + err.message);
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
      , BATCH_SIZE_LIMIT = 50
      , errorCodePrefix = 's_sm_as_hs_validateParams_'
    ;

    return new Promise(async function (onResolve) {
      let errorCode = null
        , errorMsg = null
      ;

      oThis.hasAnyInvalidShard = function(){
        for (let ind = 0; ind < oThis.shardNames.length ; ind++) {
          let shardName = oThis.shardNames[ind];
          if (!shardName) {
            return true;
          }
        }
        return false;
      };

      if (!oThis.shardNames || oThis.shardNames.constructor.name !== 'Array') {
        errorCode = errorCodePrefix + '1';
        errorMsg = 'shardNames is undefined or not an array';
      } else if (oThis.shardNames.length > BATCH_SIZE_LIMIT) {
        errorCode = errorCodePrefix + '2';
        errorMsg = 'shardNames length exceeds 50 batch size';
      } else if (oThis.hasAnyInvalidShard()) {
        errorCode = errorCodePrefix + '3';
        errorMsg = 'One of the shardName is invalid' + oThis.shardNames;
      } else {
        return onResolve(responseHelper.successWithData({}));
      }

      logger.debug(errorCode, errorMsg);
      return onResolve(responseHelper.error(errorCode, errorMsg));
    });
  },

  /**
   * Has Shard call from Cache
   * @return {Promise<*>}
   */
  hasShardFromCache: async function() {
    const oThis = this
      , cacheParams = {
      ddb_object: oThis.ddbObject,
      shard_names: oThis.shardNames
    };
    let r = await new HasShardMultiCacheKlass(cacheParams).fetch();
    logger.debug("=======HasShard.hasShard.result=======");
    logger.debug(r);

    if (r.isSuccess()) {
      return r;
    } else {
      return responseHelper.error(r.err.error_data, r.err.code, r.err.msg);
    }
  }
};

module.exports = HasShard;
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
 * Constructor to create object of Configure Shard
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
// TODO batch get size of 50 validation
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

      const cacheParams = {
        ddb_object: oThis.ddbObject,
        shard_names: oThis.shardNames
      };
      r = await new HasShardMultiCacheKlass(cacheParams).fetch();
      logger.debug("=======HasShard.hasShard.result=======");
      logger.debug(r);
      // TODO check if test cases are failing
      if (r.isSuccess()) {
        return r;
      } else {
        return responseHelper.error(r.err.error_data, r.err.code, r.err.msg);
      }
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
    ;

    return new Promise(async function (onResolve) {

      if (!oThis.shardNames || oThis.shardNames.constructor.name !== 'Array') {
        logger.debug('s_sm_as_hs_validateParams_1', 'shardName is', oThis.shardName);
        return onResolve(responseHelper.error('s_sm_as_hs_validateParams_1', 'shardNames is not an array'));
      }

      for (let ind = 0; ind < oThis.shardNames.length ; ind++) {
        let shardName = oThis.shardNames[ind];
        if (!shardName) {
          logger.debug('s_sm_as_hs_validateParams_2', 'shardName is', oThis.shardName);
          return onResolve(responseHelper.error('s_sm_as_hs_validateParams_2', 'shardName is invalid'));
        }
      }

      return onResolve(responseHelper.successWithData({}));
    });
  }
};

module.exports = HasShard;
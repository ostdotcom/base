"use strict";

/**
 *
 * This class would be used for getting shard based on id and entity type.<br><br>
 *
 * @module services/shard_management/managed_shard/get_shard
 *
 */

const rootPrefix = '../../../..'
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , managedShardConst = require(rootPrefix + '/lib/global_constant/managed_shard')
  , GetShardNameMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/get_shard_name')
  , moduleName = 'services/shard_management/managed_shard/get_shard'
  , responseHelper = new ResponseHelper({module_name: moduleName})
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
;

/**
 * Constructor to create object of Get Shard Name
 *
 * @constructor
 *
 * @params {object} params -
 * @param {string} params.ids - ids are object of keys
 * @param {object} params.ddb_object - dynamo db object
 * @return {Object}
 *
 */
const GetShardName = function (params) {
  const oThis = this;
  logger.debug("=======GetShardName.params=======");
  logger.debug(params);
  oThis.params = params;
  oThis.ddbObject = params.ddb_object;
  oThis.ids = params.ids;
};

GetShardName.prototype = {

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
      logger.debug("=======GetShardName.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      const cacheParams = {
        ddb_object: oThis.ddbObject,
        ids: oThis.ids
      };
      r = await new GetShardNameMultiCacheKlass(cacheParams).fetch();
      logger.debug("=======GetShardName.getShard.result=======");
      logger.debug(r);
      if (r.isSuccess()) {
        return responseHelper.successWithData(r.data);
      } else {
        return responseHelper.error(r.err.error_data, r.err.code, r.err.msg);
      }
    } catch(err) {
      return responseHelper.error('s_sm_as_gsn_perform_1', 'Something went wrong. ' + err.message);
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

      if (!oThis.ids || oThis.ids.constructor.name !== 'Array') {
        logger.debug('s_sm_as_gsn_validateParams_1', 'ids is', oThis.ids);
        return onResolve(responseHelper.error('s_sm_as_gns_validateParams_1', 'ids is not an array'));
      }

      for (let ind = 0; ind < oThis.ids.length ; ind++) {
        let object = oThis.ids[ind];
        if (!object) {
          logger.debug('s_sm_as_gsn_validateParams_2', 'object is undefined');
          return onResolve(responseHelper.error('s_sm_as_gsn_validateParams_2', 'object is undefined'));
        }

        if (!object.identifier) {
          logger.debug('s_sm_as_gsn_validateParams_3', 'identifier is', object.identifier);
          return onResolve(responseHelper.error('s_sm_as_gsn_validateParams_3', 'identifier is undefined'));
        }

        if (!(managedShardConst.getSupportedEntityTypes()[object.entity_type])) {
          logger.debug('s_sm_as_gsn_validateParams_4', 'entityType is', object.entity_type);
          return onResolve(responseHelper.error('s_sm_as_gsn_validateParams_4', 'entityType is not supported'));
        }
      }

      return onResolve(responseHelper.successWithData({}));
    });
  }
};

module.exports = GetShardName;
"use strict";

/**
 *
 * This class would be used for getting shard based on id and entity type.<br><br>
 *
 * @module services/shard_management/managed_shard/get_shard
 *
 */

const rootPrefix = '../../../..'
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response_helper')
  , managedShardConst = require(rootPrefix + '/lib/global_constant/managed_shard')
  , GetShardDetailsMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/get_shard_details')
  , moduleName = 'services/shard_management/managed_shard/get_shard'
  , responseHelper = require(rootPrefix + '/lib/response')
  , coreConstants = require(rootPrefix + "/config/core_constants")
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
;

/**
 * Constructor to create object of Get Shard Details
 *
 * @constructor
 *
 * @params {object} params -
 * @param {object} params.ddb_object - dynamodb object
 * @param {string} params.entity_type - entity type
 * @param {string} params.identifiers - identifiers are object of keys
 *
 * @return {Object}
 *
 */

const GetShardDetails = function (params) {
  const oThis = this;
  logger.debug("=======GetShardDetails.params=======");
  logger.debug(params);
  oThis.params = params;
  oThis.ddbObject = params.ddb_object;
  oThis.entityType = params.entity_type;
  oThis.identifiers = params.identifiers;
};

GetShardDetails.prototype = {

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
      logger.debug("=======GetShardDetails.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      const cacheParams = {
        ddb_object: oThis.ddbObject,
        entity_type: oThis.entityType,
        identifiers: oThis.identifiers
      };
      r = await new GetShardDetailsMultiCacheKlass(cacheParams).fetch();
      logger.debug("=======GetShardDetails.GetShardDetailsMultiCache.result=======");
      logger.debug(r);
      if (r.isSuccess()) {
        return responseHelper.successWithData(r.data);
      } else {
        return r;
      }
    } catch (err) {
      return responseHelper.error({
        internal_error_identifier: "s_sm_as_gsd_perform_1",
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
      , errorCodePrefix = 's_sm_as_gsd_validateParams_'
    ;

    return new Promise(async function (onResolve) {
      let errorCode = null,
        params_error_identifier = null;
      ;

      if (!managedShardConst.getSupportedEntityTypes()[oThis.entityType]) {
        errorCode = errorCodePrefix + '1';
        params_error_identifier = "invalid_entity_type";
      }

      if (!oThis.identifiers || oThis.identifiers.constructor.name !== 'Array') {
        errorCode = errorCodePrefix + '2';
        params_error_identifier = "invalid_input_array";
      }

      for (let ind = 0; ind < oThis.identifiers.length; ind++) {
        let id = oThis.identifiers[ind];
        if (!id) {
          errorCode = errorCodePrefix + '3';
          params_error_identifier = "invalid_identifier";
          break;
        }
      }

      if (params_error_identifier != null) {
        logger.debug(errorCode, params_error_identifier);
        return onResolve(responseHelper.paramValidationError({
          internal_error_identifier: errorCode,
          api_error_identifier: "invalid_api_params",
          params_error_identifiers: [params_error_identifier],
          debug_options: {},
          error_config: coreConstants.ERROR_CONFIG
        }));
      }

      return onResolve(responseHelper.successWithData({}));
    });
  }
};

module.exports = GetShardDetails;
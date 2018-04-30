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
  , managedShard = require(rootPrefix + '/lib/models/dynamodb/managed_shard')
  , managedShardConst = require(rootPrefix + '/lib/global_constant/managed_shard')
  , moduleName = 'services/shard_management/managed_shard/get_shard'
  , responseHelper = new ResponseHelper({module_name: moduleName})
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
;

/**
 * Constructor to create object of Get Shard
 *
 * @constructor
 *
 * @params {object} params -
 * @param {string} params.identifier - Identifier
 * @param {string} params.entity_type - entity type
 * @return {Object}
 *
 */
const GetShard = function (params) {
  const oThis = this;
  logger.debug("=======GetShards.params=======");
  logger.debug(params);

  oThis.identifier = params.identifier;
  oThis.entityType = params.entity_type;
};

GetShard.prototype = {

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
      logger.debug("=======GetShards.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await managedShard.getShard({identifier: oThis.identifier, entity_type: oThis.entityType});
      logger.debug("=======GetShards.addShard.result=======");
      logger.debug(r);
      return r;
    } catch(err) {
      return responseHelper.error('s_sm_as_gs_perform_1', 'Something went wrong. ' + err.message);
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

      if (!oThis.identifier) {
        logger.debug('s_sm_as_gs_validateParams_1', 'identifier is', oThis.identifier);
        return onResolve(responseHelper.error('s_sm_as_gs_validateParams_1', 'identifier is undefined'));
      }

      if (!(managedShardConst.getSupportedEntityTypes()[oThis.entityType])) {
        logger.debug('s_sm_as_gs_validateParams_2', 'entityType is', oThis.entityType);
        return onResolve(responseHelper.error('s_sm_as_gs_validateParams_2', 'entityType is not supported'));
      }

      return onResolve(responseHelper.successWithData({}));
    });
  }
};

module.exports = GetShard;
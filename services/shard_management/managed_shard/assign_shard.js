"use strict";

/**
 *
 * This class would be used to assign shard based on id.<br><br>
 *
 * @module services/shard_management/managed_shard/assign_shard
 *
 */

const rootPrefix = '../../..'
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , moduleName = 'services/shard_management/managed_shard/assign_shard'
  , responseHelper = new ResponseHelper({module_name: moduleName})
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
;

/**
 * Constructor to create object of Assign Shard
 *
 * @constructor
 *
 * @params {object} params -
 * @param {string} params.id - id of the shard
 * @param {string} params.entity_type - schema of the table in shard
 * @param {integer} params.serial_number - Serial number of the shard
 *
 * @return {Object}
 *
 */
const AssignShard = function (params) {
  const oThis = this;
  logger.debug("=======AssignShard.params=======");
  logger.debug(params);
  oThis.id = params.id;
  oThis.entityType = params.entity_type;
  oThis.serialNumber = params.serial_number;

};

AssignShard.prototype = {

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
      logger.debug("=======AssignShard.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await oThis.getShards();
      logger.debug("=======AssignShard.addShard.result=======");
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

      if (!oThis.shardType || !(oThis.shardType === 'all' || oThis.shardType === 'enabled' || oThis.shardType === 'disabled')) {
        logger.debug('s_sm_as_gs_validateParams_1', 'shardType is', oThis.shardType);
        return onResolve(responseHelper.error('s_sm_as_gs_validateParams_1', 'shardType is invalid'));
      }

      return onResolve(responseHelper.successWithData({}));
    });
  },

  /**
   * Run add shard
   *
   * @return {Promise<any>}
   *
   */
  getShards: function () {
    const oThis = this
    ;

    return new Promise(async function (onResolve) {
      try {
        // Todo:: Get shard based on params
        return onResolve(responseHelper.successWithData({}));
      } catch (err) {
        return onResolve(responseHelper.error('s_sm_as_gs_getShards_1', 'Error getting shards. ' + err));
      }
    });
  }
};

module.exports = AssignShard;
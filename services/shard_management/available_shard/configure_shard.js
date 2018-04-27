"use strict";

/**
 *
 * This class would be used to configure existing available shard.<br><br>
 *
 * @module services/shard_management/available_shard/configure_shard
 *
 */

const rootPrefix = '../../..'
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
;

/**
 * Constructor to create object of Configure Shard
 *
 * @constructor
 *
 * @params {object} params -
 * @param {string} params.shard_name - Name of the shard
 * @param {boolean} params.enable_allocation - to enable or disable allocation
 *
 * @return {Object}
 *
 */
const ConfigureShard = function (params) {
  const oThis = this;
  params = params || {};
  logger.debug("=======addShard.params=======");
  logger.debug(params);

  oThis.shardName = params.shard_name;
  oThis.enableAlloction = params.enable_allocation;
};

ConfigureShard.prototype = {

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
      logger.debug("=======ConfigureShard.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await oThis.configureShard();
      logger.debug("=======ConfigureShard.configureShard.result=======");
      logger.debug(r);
      return r;
    } catch(err) {
      return responseHelper.error('s_sm_as_cs_perform_1', 'Something went wrong. ' + err.message);
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

      if (!oThis.shardName) {
        logger.debug('s_sm_as_cs_validateParams_1', 'shardName is', oThis.shardName);
        return onResolve(responseHelper.error('s_sm_as_cs_validateParams_1', 'shardName is invalid'));
      }

      if (typeof(oThis.enable_allocation) !== 'boolean') {
        logger.debug('s_sm_as_cs__validateParams_2', 'enable_allocation is', oThis.enable_allocation);
        return onResolve(responseHelper.error('s_sm_as_cs__validateParams_2', 'enable_allocation is invalid'));
      }

      return onResolve(responseHelper.successWithData({}));
    });
  },

  /**
   * Run configure shard
   *
   * @return {Promise<any>}
   *
   */
  configureShard: function () {
    const oThis = this
    ;

    return new Promise(async function (onResolve) {
      try {
        // Todo::
        return onResolve(responseHelper.successWithData({}));
      } catch (err) {
        return onResolve(responseHelper.error('s_sm_as_as_configureShard_1', 'Error configuring shard. ' + err));
      }
    });
  }
};

module.exports = ConfigureShard;
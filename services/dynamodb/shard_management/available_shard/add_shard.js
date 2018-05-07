"use strict";

/**
 *
 * This class would be used for adding new shard.<br><br>
 *
 * @module services/shard_management/available_shard/add_shard
 *
 */

const rootPrefix = '../../../..'
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , availableShard = require( rootPrefix + '/lib/models/dynamodb/available_shard')
  , HasShardMultiCacheKlass = require(rootPrefix + '/services/cache_multi_management/has_shard')
  , moduleName = 'services/shard_management/available_shard/add_shard'
  , responseHelper = new ResponseHelper({module_name: moduleName})
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
;

/**
 * Constructor to create object of Add Shard
 *
 * @constructor
 *
 * @params {object} params -
 * @param {string} params.ddb_object - dynamoDbObject
 * @param {string} params.shard_name - Shard Name
 * @param {string} params.entity_type - entity type of shard
 * @param {JSON} params.table_schema - schema of the table in shard
 *
 * @return {Object}
 *
 */
const AddShard = function (params) {
  const oThis = this;
  logger.debug("=======addShard.params=======");
  logger.debug(params);

  oThis.params = params;
  oThis.shardName = params.shard_name;
  oThis.ddbObject = params.ddb_object;
  oThis.entityType = params.entity_type;
  oThis.tableSchema = params.table_schema;
};

AddShard.prototype = {

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
      logger.debug("=======AddShard.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await availableShard.addShard(oThis.params);
      logger.debug("=======AddShard.addShard.result=======");
      logger.debug(r);

      /******************** Cache clearance *********************/
      const cacheParams = {
        ddb_object: oThis.ddbObject,
        shard_names: [oThis.shardName]
      };
      new HasShardMultiCacheKlass(cacheParams).clear();

      /******************** Cache clearance *********************/

      return r;
    } catch(err) {
      return responseHelper.error('s_sm_as_as_perform_1', 'Something went wrong. ' + err.message);
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
      , MINIMUM_SCHEMA_KEYS = 3
    ;

    return new Promise(async function (onResolve) {

      if (!oThis.shardName) {
        logger.debug('s_sm_as_as_validateParams_1', 'shardName is', oThis.shardName);
        return onResolve(responseHelper.error('s_sm_as_as_validateParams_1', 'shardName is invalid'));
      }

      if (!oThis.entityType) {
        logger.debug('s_sm_as_as_validateParams_2', 'entityType is', oThis.entityType);
        return onResolve(responseHelper.error('s_sm_as_as_validateParams_1', 'entityType is invalid'));
      }

      if (!oThis.tableSchema || Object.keys(oThis.tableSchema).length < MINIMUM_SCHEMA_KEYS) {
        logger.debug('s_sm_as_as_validateParams_3', 'tableSchema is', oThis.tableSchema);
        return onResolve(responseHelper.error('s_sm_as_as_validateParams_2', 'tableSchema is invalid'));
      }

      return onResolve(responseHelper.successWithData({}));
    });
  }

};

module.exports = AddShard;
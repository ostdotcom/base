"use strict";

/**
 * Available Shard Model
 *
 * @module models/dynamodb/available_shard
 *
 */

const rootPrefix = '../../..'
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , moduleName = 'lib/models/dynamodb/available_shard'
  , responseHelper = new ResponseHelper({module_name: moduleName})
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
;

/**
 * Constructor Available Shard Model
 *
 * @constructor
 */
const AvailableShard = function () {
};

AvailableShard.prototype = {

  /**
   * Run add shard
   * @params {object} params -
   * @param {string} params.entity_type - entity type of shard
   * @param {JSON} params.table_schema - schema of the table in shard
   * @return {Promise<any>}
   *
   */
  addShard: function (params) {
    const oThis = this
      , entityType = params.entity_type
      , tableSchema = params.table_schema;

    return new Promise(async function (onResolve) {
      try {

        const createShardNameResponse = await oThis.buildShardName();
        logger.debug("=======AddShard.addShard.buildShardName=======");
        logger.debug(r);
        if (createShardNameResponse.isFailure()) return createShardNameResponse;

        const shardTableName = createShardNameResponse.data
          , addShardResponse = await oThis.createShardTable(shardTableName);
        logger.debug("=======AddShard.addShard.createShardTable=======");
        logger.debug(addShardResponse);
        if (addShardResponse.isFailure()) return addShardResponse;

        const addShardEntryResponse = await oThis.addShardTableEntry(shardTableName);
        logger.debug("=======AddShard.addShard.addShardTableEntry=======");
        logger.debug(addShardEntryResponse);
        if (addShardEntryResponse.isFailure()) return addShardEntryResponse;

        return onResolve(responseHelper.successWithData({}));
      } catch (err) {
        return onResolve(responseHelper.error('s_sm_as_as_addShard_1', 'Error adding shard. ' + err));
      }
    });
  },

  /**
   * To build shard Name by fetching last shard entry.
   */
  buildShardName: function () {
    //Todo :: build shard name
  },

  /**
   * To Create Shard table
   * @param shardTableName Shard Table Name
   */
  createShardTable: function (shardTableName) {
    //Todo :: create shard table
  },

  /**
   * To add Shard table entry in available shard table
   * @param shardTableName Shard Table Name
   */
  addShardTableEntry: function (shardTableName) {
    //Todo :: add shard table entry
  },

  /**
   * Run configure shard
   *
   * @params {object} params -
   * @param {string} params.shard_name - Name of the shard
   * @param {boolean} params.enable_allocation - to enable or disable allocation
   *
   * @return {Promise<any>}
   *
   */
  configureShard: function (params) {
    const oThis = this
      , shardName = params.shard_name
      , enableAllocation = params.enable_allocation
    ;

    return new Promise(async function (onResolve) {
      try {
        // Todo::
        return onResolve(responseHelper.successWithData({}));
      } catch (err) {
        return onResolve(responseHelper.error('s_sm_as_as_configureShard_1', 'Error configuring shard. ' + err));
      }
    });
  },

  /**
   * Run add shards
   *
   * @param {string} params.shard_type - get shard type Example :- 'all', 'enabled', 'disabled' (Default 'All')
   *
   * @return {Promise<any>}
   *
   */
  getShards: function (params) {
    const oThis = this
      , shardType = params.shard_type
    ;

    return new Promise(async function (onResolve) {
      try {
        // TODO:: Get shards based on params
        return onResolve(responseHelper.successWithData({}));
      } catch (err) {
        return onResolve(responseHelper.error('s_sm_as_gs_getShards_1', 'Error getting shards. ' + err));
      }
    });
  }
};

module.exports = new AvailableShard();
"use strict";

/**
 *
 * This class would be used for adding new shard.<br><br>
 *
 * @module services/shard_management/available_shard/add_shard
 *
 */

const rootPrefix = '../../..'
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
;

/**
 * Constructor to create object of Add Shard
 *
 * @constructor
 *
 * @params {object} params -
 * @param {string} params.entity_type - entity type of shard
 * @param {JSON} params.table_schema - schema of the table in shard
 *
 * @return {Object}
 *
 */
const AddShard = function (params) {
  const oThis = this;
  params = params || {};
  logger.debug("=======addShard.params=======");
  logger.debug(params);

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

      r = await oThis.addShard();
      logger.debug("=======AddShard.addShard.result=======");
      logger.debug(r);
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

      if (!oThis.entityType) {
        logger.debug('s_sm_as_as_validateParams_1', 'entityType is', oThis.entityType);
        return onResolve(responseHelper.error('s_sm_as_as_validateParams_1', 'entityType is invalid'));
      }

      if (!oThis.tableSchema || Object.keys(oThis.tableSchema).length > MINIMUM_SCHEMA_KEYS) {
        logger.debug('s_sm_as_as_validateParams_2', 'tableSchema is', oThis.tableSchema);
        return onResolve(responseHelper.error('s_sm_as_as_validateParams_2', 'tableSchema is invalid'));
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
  addShard: function () {
    const oThis = this
    ;

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
  }
};

module.exports = AddShard;
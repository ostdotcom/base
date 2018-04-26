"use strict";

/**
 *
 * This class would be used for executing migrations for shard management register.<br><br>
 *
 * @module services/shard_management/shard_migration
 *
 */

const rootPrefix = '../..'
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , logger = require(rootPrefix + '/lib/logger/custom_console_logger')
  , CreateTableKlass     = require( rootPrefix + "/services/dynamodb/create_table" )
;

/**
 * Constructor to create object of shard migration
 *
 * @constructor
 *
 * @return {Object}
 *
 */
const ShardMigrationKlass = function () {
};

ShardMigrationKlass.prototype = {

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
      logger.info("=======shard_migration.runShardMigration.started=======");
      r = await oThis.runShardMigration();
      logger.info("=======shard_migration.runShardMigration.finished=======");
      logger.debug(r);
      return r;
    } catch (err) {
      return responseHelper.error('s_sm_sm_perform_1', 'Something went wrong. ' + err.message);
    }

  },

  /**
   * Run the shard migration
   *
   * @return {Promise<any>}
   *
   */
  runShardMigration: function () {
    const oThis = this
    ;

    return new Promise(async function (onResolve) {
      try {

        await oThis.runCreateAvailableShardMigration();

        await oThis.runCreateManagedShardMigration();

        return onResolve(responseHelper.successWithData({}));

      } catch (err) {
        return onResolve(responseHelper.error('s_am_r_runRegister_1', 'Error creating airdrop record. ' + err));
      }
    });

  },

  /**
   * Run CreateAvailableShardMigration
   * @return {Promise<void>}
   */
  runCreateAvailableShardMigration: async function () {
    const oThis = this
    ;

    logger.debug("========shard_migration.runShardMigration.createAvailableShards=======");

    const availableShardsParams = {}
      , createAvailableShardObject = CreateTableKlass(availableShardsParams)
      , createTableAvailableShardsResponse = await createAvailableShardObject.perform()
    ;

    logger.debug(createAvailableShardObject);
    if (createTableAvailableShardsResponse.isFailure()) {
      logger.debug("Is Failure having err ", createTableAvailableShardsResponse.err);
      throw 'Error migrating createAvailableShards.' + createTableAvailableShardsResponse.err;
    }
    logger.debug("createAvailableShards is Success having Data ", createTableAvailableShardsResponse.data);
  },

  /**
   * Run CreateManagedShardMigration
   * @return {Promise<void>}
   */
  runCreateManagedShardMigration: async function () {
    const oThis = this
    ;

    logger.debug("========shard_migration.runShardMigration.createManagedShards=======");

    const managedShardsParams = {}
      , createManagedShardObject = new CreateTableKlass(managedShardsParams)
      , createTableManagedShardsResponse = await createManagedShardObject.perform();

    logger.debug(createManagedShardObject);
    if (createTableManagedShardsResponse.isFailure()) {
      logger.debug("Is Failure having err ", createTableManagedShardsResponse.err);
      throw 'Error migrating createManagedShards.' + createTableManagedShardsResponse.err;
    }
    logger.debug("createManagedShards is Success having Data ", createTableManagedShardsResponse.data);
  }
};

module.exports = ShardMigrationKlass;

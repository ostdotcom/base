"use strict";

/**
 *
 * This class would be used for executing migrations for shard management register.<br><br>
 *
 * @module services/shard_management/shard_migration
 *
 */

const rootPrefix = '../../..'
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , moduleName = 'services/shard_management/shard_migration'
  , responseHelper = new ResponseHelper({module_name: moduleName})
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , managedShardConst = require(rootPrefix + "/lib/global_constant/managed_shard")
  , availableShardConst = require(rootPrefix + "/lib/global_constant/available_shard")
  // , CreateTableKlass = require(rootPrefix + "/services/dynamodb/create_table")
;

/**
 * Constructor to create object of shard migration
 *
 * @constructor
 *
 * @return {Object}
 *
 */
const ShardMigration = function (params) {
  const oThis = this;
  oThis.ddbObject = params.ddb_object;
};

ShardMigration.prototype = {

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
      logger.info("=======ShardMigration.runShardMigration.started=======");
      r = await oThis.runShardMigration();
      logger.info("=======ShardMigration.runShardMigration.finished=======");
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
        return onResolve(responseHelper.error('s_am_r_runRegister_1', 'Error creating running migration. ' + err));
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

    logger.debug("========ShardMigration.runShardMigration.createAvailableShards=======");

    const availableShardsParams = {
        AttributeDefinitions: [
          {
            AttributeName: availableShardConst.NAME,
            AttributeType: "S"
          },
          {
            AttributeName: availableShardConst.ENTITY_TYPE,
            AttributeType: "S"
          },
          {
            AttributeName: availableShardConst.ALLOCATION_TYPE,
            AttributeType: "N"
          }
        ],
        KeySchema: [
          {
            AttributeName: availableShardConst.NAME,
            KeyType: "HASH"
          }
        ],
        GlobalSecondaryIndexes: [{
          IndexName: 'AS-ET-index',
          KeySchema: [
            {
              AttributeName: availableShardConst.ENTITY_TYPE,
              KeyType: 'HASH'
            },
            {
              AttributeName: availableShardConst.ALLOCATION_TYPE,
              KeyType: 'RANGE'
            }
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY'
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        },
        TableName: availableShardConst.getTableName()
      }
      // , createAvailableShardObject = new CreateTableKlass(availableShardsParams, oThis.ddbObject)
      // , createTableAvailableShardsResponse = await createAvailableShardObject.perform()
      , createTableAvailableShardsResponse = await oThis.ddbObject.createTable(availableShardsParams)
    ;

    logger.debug(createTableAvailableShardsResponse);
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

    logger.debug("========ShardMigration.runShardMigration.createManagedShards=======");

    const managedShardsParams = {
        AttributeDefinitions: [
          {
            AttributeName: "ID",
            AttributeType: "S"
          },
          {
            AttributeName: "ET",
            AttributeType: "S"
          }
        ],
        KeySchema: [
          {
            AttributeName: "ID",
            KeyType: "HASH"
          },
          {
            AttributeName: "ET",
            KeyType: "RANGE"
          }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        },
        TableName: managedShardConst.getTableName()
      }
      // , createManagedShardObject = new CreateTableKlass(managedShardsParams, oThis.ddbObject)
      // , createTableManagedShardsResponse = await createManagedShardObject.perform();
      , createTableManagedShardsResponse = await oThis.ddbObject.createTable(managedShardsParams)
    ;

    logger.debug(createTableManagedShardsResponse);
    if (createTableManagedShardsResponse.isFailure()) {
      logger.debug("Is Failure having err ", createTableManagedShardsResponse.err);
      throw 'Error migrating createManagedShards.' + createTableManagedShardsResponse.err;
    }
    logger.debug("createManagedShards is Success having Data ", createTableManagedShardsResponse.data);
  }
};

module.exports = ShardMigration;

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
  , availableShardConst = require(rootPrefix + "/lib/global_constant/available_shard")
  , managedShardConst = require(rootPrefix + "/lib/global_constant/managed_shard")
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
   * @param {object} params.ddb_object - dynamo db object
   * @param {string} params.entity_type - entity type of shard
   * @param {JSON} params.table_schema - schema of the table in shard
   * @return {Promise<any>}
   *
   */
  addShard: function (params) {
    const oThis = this
      , ddbObject = params.ddb_object
      , entityType = params.entity_type
      , tableSchema = params.table_schema;

    return new Promise(async function (onResolve) {
      try {

        logger.debug("=======AddShard.addShard.buildShardName=======");
        const createShardNameResponse = await oThis.buildShardName(ddbObject, entityType);
        logger.debug(createShardNameResponse);
        if (createShardNameResponse.isFailure()) return createShardNameResponse;

        logger.debug("=======AddShard.addShard.createShardTable=======");
        const shardTableName = createShardNameResponse.data
          , addShardResponse = await oThis.createShardTable(ddbObject, shardTableName, tableSchema);
        logger.debug(addShardResponse);
        if (addShardResponse.isFailure()) return addShardResponse;

        logger.debug("=======AddShard.addShard.addShardTableEntry=======");
        const addShardEntryResponse = await oThis.addShardTableEntry(ddbObject, shardTableName, entityType);
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
  buildShardName: function (ddbObject, entityType) {
    const oThis = this
      , entityTypeCode = managedShardConst.getSupportedEntityTypes()[entityType]
    ;

    return new Promise(async function(resolve){
      //Is valid entity type
      if (!entityTypeCode) {
        logger.error("undefined entityType");
        throw "undefined entityType";
      }

      //Query last shard number for provided entity type
      const queryParams = {TableName: availableShardConst.getTableName(),
        IndexName: availableShardConst.getIndexOnETName(),
        ExpressionAttributeValues: {
          ":v1": {
            S: entityTypeCode
          }
        },
        KeyConditionExpression: "#et = :v1",
        ExpressionAttributeNames: { "#et": "ET" },
        ProjectionExpression: "ET",

        }
        , queryResponse = await ddbObject.query(queryParams)
      ;

      if (queryResponse.isFailure()) {
        throw "Query in Available Table Failed";
      }
      let incrementedShardNumber = queryResponse.data.Count + 1;
      let numberOfZeroes = 5 - String(incrementedShardNumber).length;

      let shardNumber = '';
      while(numberOfZeroes > 0) {
        shardNumber+='0';
        numberOfZeroes-=1;
      }
      shardNumber+=String(incrementedShardNumber);

      //Create shard name by incrementing last shard number
      const shardName = 'shard_'+ shardNumber + '_' + entityType;

      logger.debug('available shard :: Shard name', shardName);
      return resolve(responseHelper.successWithData(shardName));
    });


  },

  /**
   * To create Shard table
   * @param ddbObject dynamo db object
   * @param shardTableName shard table name
   * @param tableSchema table Schema
   */
  createShardTable: function (ddbObject, shardTableName, tableSchema) {
    const oThis = this
    ;
    tableSchema.TableName = shardTableName;

    return ddbObject.createTable(tableSchema);
  },

  /**
   * To add Shard table entry in available shard table
   * @param ddbObject dynamo db object
   * @param shardTableName shard table name
   * @param entityType entity type
   */
  addShardTableEntry: function (ddbObject, shardTableName, entityType) {
    const oThis = this
      , entityTypeCode = managedShardConst.getSupportedEntityTypes()[entityType]
      , insertItemParams = {
        TableName: availableShardConst.getTableName(),
        Item: {
          NA: {S: shardTableName},
          ET: {S: entityTypeCode},
          AL: {N: '0'},
          c: {S: String(new Date().getTime())},
          a: {S: String(new Date().getTime())}
        }
      }
    ;

    //Is valid entity type
    if (!entityTypeCode) {
      logger.error("undefined entityType");
      throw "undefined entityType";
    }

    return ddbObject.putItem(insertItemParams);
  },

  /**
   * Run configure shard
   *
   * @params {object} params -
   * @param {object} params.ddb_object - dynamo db object
   * @param {string} params.shard_name - Name of the shard
   * @param {boolean} params.enable_allocation - to enable or disable allocation
   *
   * @return {Promise<any>}
   *
   */
  configureShard: function (params) {
    const oThis = this
      , ddbObject = params.ddb_object
      , shardName = params.shard_name
      , enableAllocation = params.enable_allocation
      , updateItemParam = {
      ExpressionAttributeNames: {
        "#alloc": "AL"
      },
      ExpressionAttributeValues: {
        ":t": {
          S: String(enableAllocation)
        }
      },
      Key: {
        NA: {
          S: shardName
        }
      },
      ReturnValues: "ALL_NEW",
      TableName: availableShardConst.getTableName(),
      UpdateExpression: "SET #alloc = :t"
    }
    ;
    // logger.log('DEBUG', JSON.stringify(updateItemParam));
    return ddbObject.updateItem(updateItemParam);
  },

  /**
   * Run add shards
   *
   * @param {object} params.ddb_object - dynamo db object
   * @param {string} params.shard_type - get shard type Example :- 'all', 'enabled', 'disabled' (Default 'All')
   *
   * @return {Promise<any>}
   *
   */
  getShards: function (params) {
    const oThis = this
      , ddbObject = params.ddb_object
      , shardTypeCode = availableShardConst.getShardTypes()[params.shard_type]
      , queryParams = {
        TableName: availableShardConst.getTableName(),
        IndexName: availableShardConst.getIndexOnALName(),
        ExpressionAttributeValues: {
          ":v1": {
            N: String(shardTypeCode)
          }
        },
        KeyConditionExpression: "#al = :v1",
        ExpressionAttributeNames: {"#al": "AL",
          '#na':'NA',
          '#et': 'ET'},
        ProjectionExpression: "#na, #et, #al",
      }
    ;

    if (shardTypeCode === undefined) {
      throw "shardTypeCode is undefined"
    }

    // logger.log("DEBUG...", shardTypeCode);
    return  ddbObject.query(queryParams);
  }
};

module.exports = new AvailableShard();
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
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , availableShardConst = require(rootPrefix + "/lib/global_constant/available_shard")
  , managedShardConst = require(rootPrefix + "/lib/global_constant/managed_shard")
  , basicHelper = require(rootPrefix + '/helpers/basic')
;

/**
 * Constructor Available Shard Model
 *
 * @constructor
 */
const AvailableShard = function () {
};

AvailableShard.prototype = {

  getItem: function (ddbItem) {
    return new Item(ddbItem);
  },

  // For representation purpose
  columnNameMapping: function () {
    return {
      'SN': 'shard_name',
      'ET': 'entity_type',
      'AL': 'allocation_type',
      'C': 'created_at',
      'U': 'updated_at'
    }
  },

  invertedColumnNameMapping: function () {
    const oThis = this
    ;
    return basicHelper.reverseObject(oThis.columnNameMapping);
  },

  /**
   * Run add shard
   * @params {object} params -
   * @param {object} params.ddb_object - dynamo db object
   * @param {string} params.shard_name - shard name
   * @param {string} params.entity_type - entity type of shard
   * @param {JSON} params.table_schema - schema of the table in shard
   * @return {Promise<any>}
   *
   */
  addShard: function (params) {
    const oThis = this
      , ddbObject = params.ddb_object
      , shardName = params.shard_name
      , entityType = params.entity_type
      , tableSchema = params.table_schema;

    return new Promise(async function (onResolve) {
      try {

        logger.debug("=======AddShard.addShard.createShardTable=======");
        const addShardResponse = await oThis.createShardTable(ddbObject, shardName, tableSchema);
        logger.debug(addShardResponse);
        if (addShardResponse.isFailure()) return addShardResponse;

        logger.debug("=======AddShard.addShard.addShardTableEntry=======");
        const addShardEntryResponse = await oThis.addShardTableEntry(ddbObject, shardName, entityType);
        logger.debug(addShardEntryResponse);
        if (addShardEntryResponse.isFailure()) return addShardEntryResponse;

        return onResolve(responseHelper.successWithData({}));
      } catch (err) {
        return onResolve(responseHelper.error('s_sm_as_as_addShard_1', 'Error adding shard. ' + err));
      }
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
          [availableShardConst.SHARD_NAME]: {S: shardTableName},
          [availableShardConst.ENTITY_TYPE]: {S: entityTypeCode},
          [availableShardConst.ALLOCATION_TYPE]: {N: '0'},
          [availableShardConst.CREATED_AT]: {S: String(new Date().getTime())},
          [availableShardConst.UPDATED_AT]: {S: String(new Date().getTime())}
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
          "#alloc": availableShardConst.ALLOCATION_TYPE
        },
        ExpressionAttributeValues: {
          ":t": {
            S: String(enableAllocation)
          }
        },
        Key: {
          [availableShardConst.SHARD_NAME]: {
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
   * Run has shard
   *
   * @params {object} params -
   * @param {object} params.ddb_object - dynamo db object
   * @param {string} params.shard_name - Name of the shard
   *
   * @return {Promise<any>}
   *
   */
  hasShard: async function (params) {
    const oThis = this
      , ddbObject = params.ddb_object
      , shardName = params.shard_name
      , queryParams = {
        TableName: availableShardConst.getTableName(),
        ExpressionAttributeValues: {
          ":v1": {
            S: String(shardName)
          }
        },
        KeyConditionExpression: "#sn = :v1",
        ExpressionAttributeNames: {"#sn": availableShardConst.SHARD_NAME},
        ProjectionExpression: "#sn",
      }
    ;
    // logger.log('DEBUG', JSON.stringify(updateItemParam));
    const response = await ddbObject.query(queryParams);
    if (response.data.Count > 0) {
      return responseHelper.successWithData({has_shard: true});
    } else {
      return responseHelper.successWithData({has_shard: false});
    }
  },

  /**
   * Run add shards
   *
   * @param {object} params.ddb_object - dynamo db object
   * @param {string} params.entity_type - get entity type
   * @param {string} params.shard_type - get shard type Example :- 'all', 'enabled', 'disabled' (Default 'All')
   *
   * @return {Promise<any>}
   *
   */
  getShards: function (params) {
    const oThis = this
      , ddbObject = params.ddb_object
      , entityType = managedShardConst.getSupportedEntityTypes()[params.entity_type]
      , shardTypeCode = availableShardConst.getShardTypes()[params.shard_type]
      , queryParams = {
        TableName: availableShardConst.getTableName(),
        IndexName: availableShardConst.getIndexOnETName(),
        ExpressionAttributeValues: {
          ":v1": {
            S: String(entityType)
          },
          ":v2": {
            N: String(shardTypeCode)
          }
        },
        KeyConditionExpression: "#et = :v1 AND #al = :v2",
        ExpressionAttributeNames: {
          "#al": availableShardConst.ALLOCATION_TYPE,
          '#et': availableShardConst.ENTITY_TYPE
        },
        ProjectionExpression: "#et, #al",
      }
    ;

    logger.log("DEBUG", shardTypeCode, params.shard_type);
    if (shardTypeCode === undefined) {
      throw "shardTypeCode is undefined"
    }

    if (entityType === undefined) {
      throw "entityType is undefined"
    }

    // logger.log("DEBUG...", shardTypeCode);
    return ddbObject.query(queryParams);
  }
};

const Item = function(ddbItem) {
  const oThis = this
  ;
  oThis.ddbItem = ddbItem;
};

Item.prototype = {

  shardName: function() {
    const oThis = this
    ;
    return oThis.ddbItem.SN;
  },

  entityType: function() {
    const oThis = this
    ;
    return oThis.ddbItem.ET;
  },

  allocationType: function() {
    const oThis = this
    ;
    return oThis.ddbItem.AL;
  },

  createdAt: function() {
    const oThis = this
    ;
    return oThis.ddbItem.C;
  },

  updatedAt: function() {
    const oThis = this
    ;
    return oThis.ddbItem.U;
  }
};

module.exports = new AvailableShard();
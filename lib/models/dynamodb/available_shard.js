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
   * @param {string} params.shard_names - Name of the shard
   *
   * @return {Promise<any>}
   *
   */
  hasShard: async function (params) {
    const oThis = this
      , ddbObject = params.ddb_object
      , shardNames = params.shard_names
      , promiseArray = []
      , dataResponse = {}
    ;

    try {
      for (let ind = 0; ind < shardNames.length; ind++) {
        let queryParams = {
            TableName: availableShardConst.getTableName(),
            ExpressionAttributeValues: {
              ":v1": {
                S: String(shardNames[ind])
              }
            },
            KeyConditionExpression: "#sn = :v1",
            ExpressionAttributeNames: {"#sn": availableShardConst.SHARD_NAME},
            ProjectionExpression: "#sn"
          }
        ;
        promiseArray.push(ddbObject.query(queryParams));
      }

      const responseArray = await Promise.all(promiseArray);

      for (let ind = 0; ind < responseArray.length; ind++) {
        let resp = responseArray[ind];
        let hasShard = {};
        if (resp.isSuccess()) {
          hasShard.has_shard = resp.data.Count > 0;
          dataResponse[shardNames[ind]] = hasShard
        }
      }
    } catch (err) {
      logger.error("error in available_shards :: hasShard ", err);
      return responseHelper.errorWithData(err);
    }

    return responseHelper.successWithData(dataResponse);

  },

  /**
   * Run add shards
   *
   * @param {object} params.ddb_object - dynamo db object
   * @param {array} params.ids - ids containing entity type and shard type
   * @param {string} params.ids.entity_type - get entity type
   * @param {object} params.id_value_map - id to hash map
   * @param {string} params.ids.shard_type - get shard type Example :- 'all', 'enabled', 'disabled' (Default 'All')
   *
   * @return {Promise<any>}
   *
   */
  getShards: async function (params) {
    const oThis = this
      , ddbObject = params.ddb_object
      , ids = params.ids
      , idToValueMap = params.id_value_map
      , promiseArray = []
      , dataResponse = {}
    ;

    try {
      for (let ind = 0; ind < ids.length; ind++) {
        let objectKey = ids[ind];
        let object = idToValueMap[objectKey];

        let entityType = managedShardConst.getSupportedEntityTypes()[object.entity_type]
          , shardTypeCode = availableShardConst.getShardTypes()[object.shard_type]
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

        // logger.log("DEBUG m_dy_as", params);
        if (shardTypeCode === undefined) {
          throw "shardTypeCode is undefined"
        }

        if (entityType === undefined) {
          throw "entityType is undefined"
        }

        promiseArray.push(ddbObject.query(queryParams));
      }

      const responseArray = await Promise.all(promiseArray);

      for (let ind = 0; ind < responseArray.length; ind++) {
        let resp = responseArray[ind];
        if (resp.isSuccess()) {
          dataResponse[ids[ind]] = resp.data.Items;
        }
      }
    } catch (err) {
      logger.error("error in available_shards :: getShards ", err);
      return responseHelper.errorWithData(err);
    }

    return responseHelper.successWithData(dataResponse);
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
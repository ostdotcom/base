"use strict";

/**
 * Managed Shard Model
 *
 * @module lib/models/dynamodb/managed_shard
 *
 */

const rootPrefix = '../../..'
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , moduleName = 'lib/models/dynamodb/managed_shard'
  , responseHelper = new ResponseHelper({module_name: moduleName})
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
  , basicHelper = require(rootPrefix+'/helpers/basic')
  , managedShardConst = require(rootPrefix + "/lib/global_constant/managed_shard")
;

/**
 * Constructor Managed Shard Model
 *
 * @constructor
 */
const ManagedShard = function() {};

ManagedShard.prototype = {

  // For representation purpose
  columnNameMapping: function(){
    return {
      [managedShardConst.IDENTIFIER]: 'identifier',
      [managedShardConst.ENTITY_TYPE]: 'entity_type',
      [managedShardConst.SHARD_NAME]: 'shard_name',
      [managedShardConst.CREATED_AT]: 'created_at',
      [managedShardConst.UPDATED_AT]: 'updated_at'
    }
  },

  getItem: function(ddbItem) {
    return new Item(ddbItem);
  },

  invertedColumnNameMapping: function(){
    const oThis = this
    ;
    return basicHelper.reverseObject(oThis.columnNameMapping);
  },

  /**
   * Run get shard
   *
   * @param {object} params.ddb_object - dynamo db object
   * @param {array} params.ids - ids containing identifier and entity type
   * @param {object} params.id_value_map - id to hash map
   * @param {string} params.identifier - identifier
   * @param {string} params.entity_type - entity type
   *
   * @return {Promise<any>}
   *
   */
  // TODO we should use batchGet here to optimize queries
  // TODO return result mapping needs to be corrected
  getShard: async function (params) {
    const oThis = this
      , ddbObject = params.ddb_object
      , ids = params.ids
      , idToValueMap = params.id_value_map
      , promiseArray = []
      , dataResponse = {}
    ;
    try {
      for (let ind = 0; ind < ids.length; ind++) {
        let objectKey = ids[ind]
          , object = idToValueMap[objectKey]
          , entityType = object.entity_type
          , identifier = object.identifier
          , entityTypeCode = managedShardConst.getSupportedEntityTypes()[entityType]
          , queryParams = {
            TableName: managedShardConst.getTableName(),
            ExpressionAttributeValues: {
              ":v1": {
                S: String(identifier)
              },
              ":v2": {
                S: String(entityTypeCode)
              }
            },
            KeyConditionExpression: "#id = :v1 AND #et = :v2",
            ExpressionAttributeNames: {
              "#id": managedShardConst.IDENTIFIER,
              '#et': managedShardConst.ENTITY_TYPE
            },
            ProjectionExpression: managedShardConst.SHARD_NAME,
            ConsistentRead: true
          }
        ;

        promiseArray.push(ddbObject.call('query', queryParams));
      }

      const responseArray = await Promise.all(promiseArray);

      for (let ind = 0; ind < responseArray.length; ind++) {
        let resp = responseArray[ind];
        // TODO should we use pojo class here
        if (resp.isSuccess() && resp.data.Items[0]) {
          dataResponse[ids[ind]] = resp.data.Items[0][managedShardConst.SHARD_NAME]['S'];
        }
      }
    } catch (err) {
      logger.error("error in managed_shard :: getShard ", err);
      return responseHelper.errorWithData(err);
    }

    return responseHelper.successWithData(dataResponse);
  },

  /**
   * Assign Shard
   *
   * @param {object} params.ddb_object - dynamo db object
   * @param {array} params.identifier - identifier
   * @param {string} params.identifier - identifier
   * @param {string} params.entity_type - entity type
   * @param {string} params.shard_name - shard name
   *
   * @return {*|promise<result>|Request<DynamoDB.PutItemOutput, AWSError>|{type, required, members}}
   */
  assignShard: function (params) {
    const oThis = this
      , ddbObject = params.ddb_object
      , identifier = params.identifier
      , entityType = params.entity_type
      , shardName = params.shard_name
      , entityTypeCode = managedShardConst.getSupportedEntityTypes()[entityType]
      , insertItemParams = {
        TableName: managedShardConst.getTableName(),
        Item: {
          [managedShardConst.IDENTIFIER]: {S: identifier},
          [managedShardConst.ENTITY_TYPE]: {S: entityTypeCode},
          [managedShardConst.SHARD_NAME]: {S: shardName},
          [managedShardConst.CREATED_AT]: {S: String(new Date().getTime())},
          [managedShardConst.UPDATED_AT]: {S: String(new Date().getTime())}
        }
      }
    ;

    //Is valid entity type
    if (!entityTypeCode) {
      logger.error("undefined entityType");
      throw "undefined entityType";
    }

    return ddbObject.call('putItem', insertItemParams);
  }
};

// TODO Item Pojo class commenting
const Item = function(ddbItem) {
  const oThis = this
  ;
  oThis.ddbItem = ddbItem;
};

Item.prototype = {

  identifier: function() {
    const oThis = this
    ;
    return oThis.ddbItem.ID;
  },

  entityType: function() {
    const oThis = this
    ;
    return oThis.ddbItem.ET;
  },

  shardName: function() {
    const oThis = this
    ;
    return oThis.ddbItem.SN;
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

module.exports = new ManagedShard();
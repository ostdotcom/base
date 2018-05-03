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

  getItem: function(ddbItem) {
    return new Item(ddbItem);
  },

  // For representation purpose
  columnNameMapping: function(){
    return {
      'ID':'identifier',
      'ET':'entity_type',
      'SN':'shard_name',
      'C': 'created_at',
      'U': 'updated_at'
    }
  },

  invertedColumnNameMapping: function(){
    const oThis = this
    ;
    return basicHelper.reverseObject(oThis.columnNameMapping);
  },

  /**
   * Run get shard
   *
   * @param {string} params.identifier - identifier
   * @param {string} params.entity_type - entity type
   *
   * @return {Promise<any>}
   *
   */
  getShard: function (params) {
    const oThis = this
      , ddbObject = params.ddb_object
      , identifier = params.identifier
      , entityType = params.entity_type
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
      ExpressionAttributeNames: {"#id": managedShardConst.IDENTIFIER,
        '#et':managedShardConst.ENTITY_TYPE},
      ProjectionExpression: managedShardConst.SHARD_NAME,
    }
    ;

    //Is valid entity type
    if (!entityTypeCode) {
      logger.error("undefined entityType");
      throw "undefined entityType";
    }

    return ddbObject.query(queryParams);
  },

  /**
   * Assign Shard
   * @param params
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

    return ddbObject.putItem(insertItemParams);
  }
};

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
"use strict";

/**
 * DynamoDB service api
 *
 * @module services/dynamodb/api
 *
 */

const rootPrefix  = "../.."
  , DdbBase = require(rootPrefix+'/lib/dynamodb/base')
  , DDBServiceBaseKlass = require(rootPrefix + "/services/dynamodb/base")
  , ShardServiceApiKlass = require(rootPrefix + '/services/dynamodb/shard_management/shard_api')
;

/**
 * Constructor for DynamoDB api service class
 *
 * @params {object} params - DynamoDB connection configurations
 *
 * @constructor
 */
const DynamoDBService = function(params) {
  const oThis = this
  ;

  oThis.ddbObject = new DdbBase(params);
};

DynamoDBService.prototype = {

  /**
   * Create table
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  createTable: function(params) {
    const oThis = this
      , createTableObject = new DDBServiceBaseKlass('createTable', params, oThis.ddbObject)
    ;
    return createTableObject.perform();
  },

  /**
   * Update table
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  updateTable: function(params) {
    const oThis = this
      , updateTableObject = new DDBServiceBaseKlass('updateTable', params, oThis.ddbObject)
    ;
    return updateTableObject.perform();
  },

  /**
   * Describe table
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  describeTable: function(params) {
    const oThis = this
      , describeTableObject = new DDBServiceBaseKlass('describeTable', params, oThis.ddbObject)
    ;
    return describeTableObject.perform();
  },

  /**
   * Delete table
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  deleteTable: function(params) {
    const oThis = this
      , deleteTableObject = new DDBServiceBaseKlass('deleteTable', params, oThis.ddbObject)
    ;
    return deleteTableObject.perform();
  },

  /**
   * Enables or disables point in time recovery for the specified table
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  updateContinuousBackup: function(params) {
    const oThis = this
      , updateContinuousBackupObject = new DDBServiceBaseKlass('updateContinuousBackups', params, oThis.ddbObject)
    ;
    return updateContinuousBackupObject.perform();
  },

  /**
   * Batch get
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  batchGet: function(params) {
    const oThis = this
      , bathGetObject = new DDBServiceBaseKlass('batchGet', params, oThis.ddbObject)
    ;
    return bathGetObject.perform();
  },

  /**
   * Batch write
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  batchWrite: function(params) {
    const oThis = this
      , bathWriteObject = new DDBServiceBaseKlass('batchWrite', params, oThis.ddbObject)
    ;
    return bathWriteObject.perform();
  },

  /**
   * Query
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  query: function(params) {
    const oThis = this
      , queryObject = new DDBServiceBaseKlass('query', params, oThis.ddbObject)
    ;
    return queryObject.perform();
  },

  /**
   * Scan
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  scan: function(params) {
    const oThis = this
      , scanObject = new DDBServiceBaseKlass('scan', params, oThis.ddbObject)
    ;
    return scanObject.perform();
  },

  /**
   * Put item
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  putItem: function(params) {
    const oThis = this
      , putItemObject = new DDBServiceBaseKlass('putItem', params, oThis.ddbObject)
    ;
    return putItemObject.perform();
  },

  /**
   * Update item
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  updateItem: function(params) {
    const oThis = this
      , updateItemObject = new DDBServiceBaseKlass('updateItem', params, oThis.ddbObject)
    ;
    return updateItemObject.perform();
  },

  /**
   * Delete item
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  deleteItem: function(params) {
    const oThis = this
      , deleteItemObject = new DDBServiceBaseKlass('deleteItem', params, oThis.ddbObject)
    ;
    return deleteItemObject.perform();
  },

  /**
   * To run shard service apis
   */
  shardManagement: function() {
    const oThis = this
    ;
    return new ShardServiceApiKlass({ddb_object: oThis.ddbObject});
  }

};

DynamoDBService.prototype.constructor = DynamoDBService;
module.exports = DynamoDBService;


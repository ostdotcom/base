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
  , WaitForServiceKlass = require(rootPrefix + "/services/dynamodb/wait_for")
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
      , createTableObject = new DDBServiceBaseKlass(oThis.ddbObject, 'createTable', params)
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
      , updateTableObject = new DDBServiceBaseKlass(oThis.ddbObject, 'updateTable', params)
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
      , describeTableObject = new DDBServiceBaseKlass(oThis.ddbObject, 'describeTable', params)
    ;
    return describeTableObject.perform();
  },

  /**
   * List table
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  listTables: function(params) {
    const oThis = this
      , listTablesObject = new DDBServiceBaseKlass(oThis.ddbObject, 'listTables', params)
    ;
    return listTablesObject.perform();
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
      , updateContinuousBackupObject = new DDBServiceBaseKlass(oThis.ddbObject, 'updateContinuousBackups', params)
    ;
    return updateContinuousBackupObject.perform();
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
   * Batch get
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  batchGet: function(params) {
    const oThis = this
      , bathGetObject = new DDBServiceBaseKlass(oThis.ddbObject, 'batchGet', params)
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
      , bathWriteObject = new DDBServiceBaseKlass(oThis.ddbObject, 'batchWrite', params)
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
      , queryObject = new DDBServiceBaseKlass(oThis.ddbObject, 'query', params)
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
      , scanObject = new DDBServiceBaseKlass(oThis.ddbObject, 'scan', params)
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
      , putItemObject = new DDBServiceBaseKlass(oThis.ddbObject, 'putItem', params)
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
      , updateItemObject = new DDBServiceBaseKlass(oThis.ddbObject, 'updateItem', params)
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
      , deleteItemObject = new DDBServiceBaseKlass(oThis.ddbObject, 'deleteItem', params)
    ;
    return deleteItemObject.perform();
  },

  /**
   * Table exists
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  tableExists: function(params) {
    const oThis = this
      , tableExistsObject = new WaitForServiceKlass(oThis.ddbObject, 'tableExists', params)
    ;
    return tableExistsObject.perform();
  },

  /**
   * Table not exists
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  tableNotExists: function(params) {
    const oThis = this
      , tableExistsObject = new WaitForServiceKlass(oThis.ddbObject, 'tableNotExists', params)
    ;
    return tableExistsObject.perform();
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


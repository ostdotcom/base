"use strict";

/**
 * DynamoDB service api
 *
 * @module services/dynamodb/api
 *
 */

const rootPrefix  = "../.."
  , DdbBase = require(rootPrefix+'/lib/dynamodb/base')
  , CreateTableServiceKlass = require(rootPrefix + '/services/dynamodb/create_table')
  , DDBServiceBaseKlass = require(rootPrefix + "/services/dynamodb/base")
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
   * Enables or disables point in time recovery for the specified table
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  updateContinuousBackup: function() {
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
  scan: function() {
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
  putItem: function() {
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
  updateItem: function() {
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
  deleteItem: function() {
    const oThis = this
      , deleteItemObject = new DDBServiceBaseKlass('deleteItem', params, oThis.ddbObject)
    ;
    return deleteItemObject.perform();
  }

};

module.exports = DynamoDBService;



/*
Example code for ddb config params
const ddbConfigParams = {};
    ddbConfigParams["apiVersion"] = coreConstants.DYNAMODB_API_VERSION;
    ddbConfigParams[keyConstants.KEY_DDB_ACCESS_KEY_ID] = coreConstants.DYNAMODB_ACCESS_KEY_ID;
    ddbConfigParams[keyConstants.KEY_DDB_SECRET_ACCESS_KEY] = coreConstants.DYNAMODB_SECRET_ACCESS_KEY;
    ddbConfigParams[keyConstants.KEY_DDB_REGION] = coreConstants.DYNAMODB_REGION;
    ddbConfigParams[keyConstants.KEY_DDB_LOGGER] = coreConstants.DYNAMODB_LOGGER;
    ddbConfigParams[keyConstants.KEY_DDB_SSL_ENABLED] = false;
    ddbConfigParams[keyConstants.KEY_DDB_MAX_RETRIES] = coreConstants.DYNAMODB_MAX_RETRIES;

*/

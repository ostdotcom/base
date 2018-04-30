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
 * Constructor for Dynamo DB api service class
 *
 * @params {object} params - DynamoDB configurations
 *
 * @constructor
 */
const DynamoDBService = function(params) {
  const oThis = this
  ;
  oThis.dbObject = new DdbBase(params);
};

DynamoDBService.prototype = {


  /**
   * Batch get
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  batchGet: async function(params) {
    const oThis = this
      , bathGetObject = new DDBServiceBaseKlass('batchGet', params, oThis.dbObject)
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
  batchWrite: async function(params) {
    const oThis = this
      , bathWriteObject = new DDBServiceBaseKlass('batchWrite', params, oThis.dbObject)
    ;
    return bathWriteObject.perform();
  },

  /**
   * Create table
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  createTable: async function(params) {
    const oThis = this
      , createTableObject = new CreateTableServiceKlass(params, oThis.dbObject)
    ;
    return createTableObject.perform();
  },

  /**
   * Describe table
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  describeTable: async function(params) {
    const oThis = this
      , describeTableObject = new DDBServiceBaseKlass('describeTable', params, oThis.dbObject)
    ;
    return describeTableObject.perform();
  },


  /**
   * Query
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  query: async function(params) {
    const oThis = this
      , queryObject = new DDBServiceBaseKlass('query', params, oThis.dbObject)
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
  scan: async function() {
    const oThis = this
      , scanObject = new DDBServiceBaseKlass('scan', params, oThis.dbObject)
    ;
    return scanObject.perform();
  },


  /**
   * Update item
   *
   * @params {object} params
   *
   * @return {promise<result>}
   *
   */
  updateItem: async function() {
    const oThis = this
      , updateItemObject = new DDBServiceBaseKlass('updateItem', params, oThis.dbObject)
    ;
    return updateItemObject.perform();
  }

};

module.exports = DynamoDBService;



/*
Example code for ddb config params
const ddbConfigParams = {};
    ddbConfigParams[keyConstants.KEY_DDB_API_VERSION] = coreConstants.DYNAMODB_API_VERSION;
    ddbConfigParams[keyConstants.KEY_DDB_ACCESS_KEY_ID] = coreConstants.DYNAMODB_ACCESS_KEY_ID;
    ddbConfigParams[keyConstants.KEY_DDB_SECRET_ACCESS_KEY] = coreConstants.DYNAMODB_SECRET_ACCESS_KEY;
    ddbConfigParams[keyConstants.KEY_DDB_REGION] = coreConstants.DYNAMODB_REGION;
    ddbConfigParams[keyConstants.KEY_DDB_LOGGER] = coreConstants.DYNAMODB_LOGGER;
    ddbConfigParams[keyConstants.KEY_DDB_SSL_ENABLED] = false;
    ddbConfigParams[keyConstants.KEY_DDB_MAX_RETRIES] = coreConstants.DYNAMODB_MAX_RETRIES;

*/

"use strict";

/**
 * DynamoDB service api
 *
 * @module services/dynamodb/api
 *
 */

const rootPrefix  = "../.."
  , DdbBase = require(rootPrefix+'/lib/dynamodb/base')
  , BatchGetServiceKlass = require(rootPrefix + '/services/dynamodb/batch_get')
  , BatchWriteServiceKlass = require(rootPrefix + '/services/dynamodb/batch_write')
  , CreateTableServiceKlass = require(rootPrefix + '/services/dynamodb/create_table')
  , DescribeTableServiceKlass = require(rootPrefix + '/services/dynamodb/describe_table')
  , QueryServiceKlass = require(rootPrefix + '/services/dynamodb/query')
  , ScanServiceKlass = require(rootPrefix + '/services/dynamodb/scan')
  , UpdateItemServiceKlass = require(rootPrefix + '/services/dynamodb/update_item')
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
      , bathGetObject = new BatchGetServiceKlass('batchGet', params, oThis.dbObject)
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
      , bathWriteObject = new BatchWriteServiceKlass('batchWrite', params, oThis.dbObject)
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
      , createTableObject = new CreateTableServiceKlass('createTable', params, oThis.dbObject)
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
      , describeTableObject = new DescribeTableServiceKlass('describeTable', params, oThis.dbObject)
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
      , queryObject = new QueryServiceKlass('query', params, oThis.dbObject)
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
      , scanObject = new ScanServiceKlass('scan', params, oThis.dbObject)
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
      , updateItemObject = new UpdateItemServiceKlass('updateItem', params, oThis.dbObject)
    ;
    return updateItemObject.perform();
  }

};

module.exports = DynamoDBService;
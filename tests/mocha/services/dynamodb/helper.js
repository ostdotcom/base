"use strict";

const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , api = require(rootPrefix + '/services/dynamodb/api')
;

/**
 * Constructor for helper class
 *
 * @constructor
 */
const helper = function() {};

helper.prototype = {

  /**
   * Validate DynamoDB API Object
   *
   * @params {object} dynamodbApiObject - DynamoDB Api object
   *
   * @return {result}
   *
   */
  validateDynamodbApiObject: function(dynamodbApiObject) {
    assert.exists(dynamodbApiObject, 'dynamodbApiObject is not created');
    assert.equal(typeof dynamodbApiObject, "object");
    assert.equal(dynamodbApiObject.constructor.name, "DynamoDBService");
  },

  /**
   * Create Table Helper method
   *
   * @params {object} dynamodbApiObject - DynamoDB Api object
   * @params {object} params - batch get params
   * @params {object} isResultSuccess - expected result
   *
   * @return {result}
   *
   */
  createTable: async function(dynamodbApiObject, params, isResultSuccess) {
    const createTableResponse = await dynamodbApiObject.createTable(params);

    if (isResultSuccess) {
      assert.equal(createTableResponse.isSuccess(), true);
      assert.exists(createTableResponse.data.TableDescription, params.TableName);
    } else{
      assert.equal(createTableResponse.isSuccess(), false, "createTable: successfull, should fail for this case");
    }
    return createTableResponse;
  },

  /**
   * Delete Table Helper method
   *
   * @params {object} dynamodbApiObject - DynamoDB Api object
   * @params {object} params - batch get params
   * @params {object} isResultSuccess - expected result
   *
   * @return {result}
   *
   */
  deleteTable: async function(dynamodbApiObject, params, isResultSuccess) {
    const deleteTableResponse = await dynamodbApiObject.deleteTable(params);

    if(isResultSuccess === true){
      assert.equal(deleteTableResponse.isSuccess(), true);
      logger.debug("deleteTableResponse.data.TableDescription",deleteTableResponse.data.TableDescription);
      assert.exists(deleteTableResponse.data.TableDescription, params.TableName);

    } else{
      assert.equal(deleteTableResponse.isSuccess(), false);
    }

    return deleteTableResponse;

  },

  /**
   * Update Continuous Backup Table Helper method
   *
   * @params {object} dynamodbApiObject - DynamoDB Api object
   * @params {object} params - batch get params
   * @params {object} isResultSuccess - expected result
   *
   * @return {result}
   *
   */
  updateContinuousBackup: async function(dynamodbApiObject, params, isResultSuccess) {
    const enableContinousBackupResponse = await dynamodbApiObject.updateContinuousBackup(params);
    if(isResultSuccess === true){
      assert.equal(enableContinousBackupResponse.isSuccess(), true);
      assert.equal(enableContinousBackupResponse.data.ContinuousBackupsStatus, 'ENABLED');
    } else {
      assert.equal(updateTableResponse.isSuccess(), false);
    }
    return enableContinousBackupResponse;
  },

  /**
   * Update Table Helper method
   *
   * @params {object} dynamodbApiObject - DynamoDB Api object
   * @params {object} params - batch get params
   * @params {object} isResultSuccess - expected result
   *
   * @return {result}
   *
   */
  updateTable: async function(dynamodbApiObject, params, isResultSuccess) {
    const updateTableResponse = await dynamodbApiObject.updateTable(params);
    if(isResultSuccess === true){
      assert.equal(updateTableResponse.isSuccess(), true);
      assert.exists(updateTableResponse.data.TableDescription, params.TableName);
    } else {
      assert.equal(updateTableResponse.isSuccess(), false);
    }
    return updateTableResponse;
  },

  /**
   * Describe Table Helper method
   *
   * @params {object} dynamodbApiObject - DynamoDB Api object
   * @params {object} params - batch get params
   * @params {object} isResultSuccess - expected result
   *
   * @return {result}
   *
   */
  describeTable: async function(dynamodbApiObject, params, isResultSuccess) {
    const describeTableResponse = await dynamodbApiObject.describeTable(params);
    if(isResultSuccess === true){
      assert.equal(describeTableResponse.isSuccess(), true);
      assert.exists(describeTableResponse.data.Table.TableName, params.TableName);
    } else {
      assert.equal(describeTableResponse.isSuccess(), false);
    }

    return describeTableResponse;
  },

  /**
   * List Tables Helper method
   *
   * @params {object} dynamodbApiObject - DynamoDB Api object
   * @params {object} params - batch get params
   * @params {object} isResultSuccess - expected result
   *
   * @return {result}
   *
   */
  listTables: async function(dynamodbApiObject, params, isResultSuccess) {
    const listTablesResponse = await dynamodbApiObject.listTables(params);
    if(isResultSuccess === true){
      assert.equal(listTablesResponse.isSuccess(), true);
      assert.include(listTablesResponse.data.TableNames, testConstants.transactionLogsTableName);
    } else {
      assert.equal(listTablesResponse.isSuccess(), false);
    }

    return listTablesResponse;
  },

  /**
   * Get dynamoDBApi object
   *
   * @params {object} dynamoDBConfig - DynamoDB connection params
   *
   * @return {object} dynamoDBApi - DynamoDBApi Object
   *
   */
  getDynamoDBApiObject: function(dynamoDBConfig){

    // validate if the dynamodb configuration is available
    assert.exists(dynamoDBConfig, 'dynamoDBConfig is neither `null` nor `undefined`');

    // create dynamoDBApi object
    const dynamoDBApi = new api(dynamoDBConfig);

    // validate if the dynamoDBApi object is created
    assert.exists(dynamoDBApi, 'dynamoDBApi is not created');
    assert.equal(typeof dynamoDBApi, "object");

    // return dynamoDBApi object
    return dynamoDBApi;
  },

  /**
   * Perform batch get
   *
   * @params {object} dynamodbApiObject - DynamoDB Api object
   * @params {object} params - batch get params
   * @params {object} isResultSuccess - expected result
   * @params {number} resultCount - Result Count
   *
   * @return {result}
   *
   */
  performBatchGetTest: async function (dynamodbApiObject, params, isResultSuccess, resultCount) {
    assert.exists(dynamodbApiObject, 'dynamoDBApiRef is neither `null` nor `undefined`');
    assert.exists(params, 'params is neither `null` nor `undefined`');

    // call batch get
    const batchGetResponse = await dynamodbApiObject.batchGet(params);

    // validate if the table is created
    assert.equal(batchGetResponse.isSuccess(), isResultSuccess, 'batch get failed');

    if (isResultSuccess) {
      // validate batchGet output count
      assert.equal(batchGetResponse.data.Responses[testConstants.transactionLogsTableName].length, resultCount, "Result count is not equal");

      // validate return output is object or not
      let returnObject = batchGetResponse.data.Responses[testConstants.transactionLogsTableName];
      if (resultCount) {
        assert.typeOf(returnObject[0], 'object');
      }
    }

    // return the response
    return batchGetResponse;
  },

  /**
   * Perform batch write
   *
   * @params {object} dynamodbApiObject - DynamoDB Api object
   * @params {object} params - batch write params
   * @params {object} isResultSuccess - expected result
   *
   * @return {result}
   *
   */
  performBatchWriteTest: async function (dynamodbApiObject, params, isResultSuccess) {
    assert.exists(dynamodbApiObject, 'dynamoDBApiRef is neither `null` nor `undefined`');
    assert.exists(params, 'params is neither `null` nor `undefined`');

    // call batch get
    const batchWriteResponse = await dynamodbApiObject.batchWrite(params);

    // validate if the table is created
    assert.equal(batchWriteResponse.isSuccess(), isResultSuccess, 'batch write failed');

    // return the response
    return batchWriteResponse;
  },

  /**
   * put Item
   * @param dynamoDbApiObject
   * @param params
   * @param isResultSuccess
   * @return {Promise<*|result|DynamoDB.PutItemOutput>}
   */
  putItem: async function(dynamoDbApiObject, params, isResultSuccess) {
    assert.exists(dynamoDbApiObject, 'dynamoDBApiRef is neither `null` nor `undefined`');
    assert.exists(params, 'params is neither `null` nor `undefined`');

    //call put Item
    const putItemResponse = await dynamoDbApiObject.putItem(params);

    // validate if the insertion is successful or not
    assert.equal(putItemResponse.isSuccess(), isResultSuccess, 'put item failed');

    return putItemResponse;

  },

  /**
   * Delete Item
   * @param dynamoDbApiObject
   * @param params
   * @param isResultSuccess
   * @return {Promise<*|result|DynamoDB.PutItemOutput>}
   */
  deleteItem: async function(dynamoDbApiObject, params, isResultSuccess) {
    assert.exists(dynamoDbApiObject, 'dynamoDBApiRef is neither `null` nor `undefined`');
    assert.exists(params, 'params is neither `null` nor `undefined`');

    //call put Item
    const deleteItemResponse = await dynamoDbApiObject.deleteItem(params);

    // validate if the delete is successful or not
    assert.equal(deleteItemResponse.isSuccess(), isResultSuccess, 'delete item failed');

    return deleteItemResponse;

  },

  /**
   * Update Item
   * @param dynamoDbApiObject
   * @param params
   * @param isResultSuccess
   * @return {Promise<*|DynamoDB.DeleteItemOutput|result>}
   */
  updateItem: async function(dynamoDbApiObject, params, isResultSuccess) {
    assert.exists(dynamoDbApiObject, 'dynamoDBApiRef is neither `null` nor `undefined`');
    assert.exists(params, 'params is neither `null` nor `undefined`');

    //call put Item
    const updateItemResponse = await dynamoDbApiObject.updateItem(params);

    // validate if the update is successful or not
    assert.equal(updateItemResponse.isSuccess(), isResultSuccess, 'update item failed');

    return updateItemResponse;

  },

  /**
   * query test helper method
   * @param dynamoDbApiObject
   * @param params
   * @param isResultSuccess
   * @param resultCount
   * @return {Promise<*>}
   */
  query: async function(dynamoDbApiObject, params, isResultSuccess, resultCount) {
    assert.exists(dynamoDbApiObject, 'dynamoDBApiRef is neither `null` nor `undefined`');
    assert.exists(params, 'params is neither `null` nor `undefined`');

    //call query
    const queryResponse = await dynamoDbApiObject.query(params);

    // validate if the query is successful or not
    assert.equal(queryResponse.isSuccess(), isResultSuccess, 'query failed');

    if (isResultSuccess) {
      // validate query output count
      assert.equal(queryResponse.data.Count, resultCount, "Result count is not equal");

      // validate return output is object or not
      if (resultCount) {
        assert.typeOf(queryResponse.data.Items[0], 'object');
      }
    }

    return queryResponse;
  },


  /**
   * scan test helper method
   * @param dynamoDbApiObject
   * @param params
   * @param isResultSuccess
   * @param resultCount
   * @return {Promise<*|DocumentClient.ScanOutput|result|DynamoDB.ScanOutput>}
   */
  scan: async function(dynamoDbApiObject, params, isResultSuccess, resultCount) {
    assert.exists(dynamoDbApiObject, 'dynamoDBApiRef is neither `null` nor `undefined`');
    assert.exists(params, 'params is neither `null` nor `undefined`');

    //call scan
    const scanResponse = await dynamoDbApiObject.scan(params);

    // validate if the scan is successful or not
    assert.equal(scanResponse.isSuccess(), isResultSuccess, 'scan failed');

    if (isResultSuccess) {
      // validate scan output count
      assert.equal(scanResponse.data.Count, resultCount, "Result count is not equal");

      // validate return output is object or not
      if (resultCount) {
        assert.typeOf(scanResponse.data.Items[0], 'object');
      }
    }

    return scanResponse;
  }
};

module.exports = new helper();
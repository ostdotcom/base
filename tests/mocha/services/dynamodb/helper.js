"use strict";

const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , testConstants = require(rootPrefix + '/tests/mocha/services/dynamodb/constants')
;

/**
 * Constructor for helper class
 *
 * @constructor
 */
const helper = function() {};

helper.prototype = {

  validateDynamodbApiObject: function(dynamodbApiObject) {
    assert.exists(dynamodbApiObject, 'dynamodbApiObject is not created');
    assert.equal(typeof dynamodbApiObject, "object");
    assert.equal(dynamodbApiObject.constructor.name, "DynamoDBService");
  },

  createTable: async function(dynamodbApiObject, params) {
    const createTableResponse = await dynamodbApiObject.createTable(params);
    assert.equal(createTableResponse.isSuccess(), true);
    assert.exists(createTableResponse.data.data.TableDescription, params.TableName);
    return createTableResponse;
  },

  deleteTable: async function(dynamodbApiObject, params) {
    const deleteTableResponse = await dynamodbApiObject.deleteTable(params);
    assert.equal(deleteTableResponse.isSuccess(), true);
    logger.debug("deleteTableResponse.data.data.TableDescription",deleteTableResponse.data.data.TableDescription);
    assert.exists(deleteTableResponse.data.data.TableDescription, params.TableName);
    return deleteTableResponse;
  },

  updateContinuousBackup: async function(dynamodbApiObject, params) {
    const enableContinousBackupResponse = await dynamodbApiObject.updateContinuousBackup(params);
    assert.equal(enableContinousBackupResponse.isSuccess(), true);
    assert.equal(enableContinousBackupResponse.data.data.ContinuousBackupsStatus, 'ENABLED');
    return enableContinousBackupResponse;
  },

  updateTable: async function(dynamodbApiObject, params) {
    const updateTableResponse = await dynamodbApiObject.deleteTable(params);
    assert.equal(updateTableResponse.isSuccess(), true);
    assert.equal(updateTableResponse.data.data.TableName, params.TableName);
    return updateTableResponse;
  },

  describeTable: async function(dynamodbApiObject, params) {
    const describeTableResponse = await dynamodbApiObject.describeTable(params);
    assert.equal(describeTableResponse.isSuccess(), true);
    assert.equal(describeTableResponse.data.data.TableName, params.TableName);
    return describeTableResponse;
  },

  listTables: async function(dynamodbApiObject, params) {
    const listTablesResponse = await dynamodbApiObject.listTables(params);
    assert.equal(listTablesResponse.isSuccess(), true);
    assert.include(listTablesResponse.data.data.TableNames, testConstants.transactionLogsTableName);
    return listTablesResponse;
  },


};

module.exports = new helper();
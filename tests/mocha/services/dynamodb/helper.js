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
    assert.equal(createTableResponse.data.TableName, params.TableName);
  },

  deleteTable: async function(dynamodbApiObject, params) {
    const deleteTableResponse = await dynamodbApiObject.deleteTable(params);
    assert.equal(deleteTableResponse.isSuccess(), true);
    assert.equal(deleteTableResponse.data.TableName, params.TableName);
  },

  updateContinuousBackup: async function(dynamodbApiObject, params) {
    const enableContinousBackupResponse = await dynamodbApiObject.updateContinuousBackup(params);
    assert.equal(enableContinousBackupResponse.isSuccess(), true);
    assert.equal(enableContinousBackupResponse.data.ContinuousBackupsStatus, 'ENABLED');
  },

  updateTable: async function(dynamodbApiObject, params) {
    const updateTableResponse = await dynamodbApiObject.deleteTable(params);
    assert.equal(updateTableResponse.isSuccess(), true);
    assert.equal(updateTableResponse.data.TableName, params.TableName);
  },

  describeTable: async function(dynamodbApiObject, params) {
    const describeTableResponse = await dynamodbApiObject.describeTable(params);
    assert.equal(describeTableResponse.isSuccess(), true);
    assert.equal(describeTableResponse.data.TableName, params.TableName);
  },

  listTables: async function(dynamodbApiObject, params) {
    const listTablesResponse = await dynamodbApiObject.listTables(params);
    assert.equal(listTablesResponse.isSuccess(), true);
    assert.include(listTablesResponse.data.data.TableNames, testConstants.transactionLogsTableName);
  },


};

module.exports = new helper();
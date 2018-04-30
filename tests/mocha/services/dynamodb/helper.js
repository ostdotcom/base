"use strict";

const chai = require('chai')
  , assert = chai.assert;

const rootPrefix  = "../.."
;

/**
 * Constructor for helper class
 *
 * @constructor
 */
const helper = function() {};

helper.prototype = {

  assertDynamodbApiObject: function(dynamodbApiObject) {
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


};

module.exports = new helper();
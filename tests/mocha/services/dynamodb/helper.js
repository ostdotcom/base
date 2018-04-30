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

  // TODO More Strict Validations for ddb object
  assertDynamodbApiObject: function(dynamodbApiObject) {
    assert.exists(dynamodbApiObject, 'dynamodbApiObject is not created');
  },

  createTable: async function(dynamodbApiObject, createTableParams) {
    const createTableResponse = await dynamodbApiObject.createTable(createTableParams);
    assert.equal(createTableResponse.isSuccess(), true);
  },

  deleteTable: async function(dynamodbApiObject, deleteTableParams) {
    const deleteTableResponse = await dynamodbApiObject.deleteTable(deleteTableParams);
    assert.equal(deleteTableResponse.isSuccess(), true);
  },

  updateContinousBackup: async function(dynamodbApiObject, updateContinousBackupParams) {
    const enableContinousBackupResponse = await dynamodbApiObject.updateContinuousBackup(updateContinousBackupParams);
    assert.equal(enableContinousBackupResponse.isSuccess(), true);
  }

};

module.exports = new helper();
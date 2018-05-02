/* global describe, it */

const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , testConstants = require(rootPrefix + '/tests/mocha/services/dynamodb/constants')
  , helper = require(rootPrefix + '/tests/mocha/services/dynamodb/helper')
  , testDataSource = require(rootPrefix + '/tests/mocha/services/dynamodb/testdata/batch_get_write_data')
;

var dynamoDBApi = null;

describe('Batch get', function () {
  before(async function() {
    this.timeout(100000);

    // get dynamoDB API object
    dynamoDBApi = helper.getDynamoDBApiObject(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS);

    // delete if table exists
    const deleteTableResponse = await helper.deleteTable(dynamoDBApi,testDataSource.DELETE_TABLE_DATA);

    // create table for the test
    const createTableResponse = await helper.createTable(dynamoDBApi,testDataSource.CREATE_TABLE_DATA, true);

    // check if the table exits:

  });

  it('should pass', function () {
    // to-do
  });

  after(function() {
    // runs after all tests in this block
    console.log('after function called');
  });

});



// mocha tests/mocha/services/dynamodb/
// mocha tests/mocha/services/dynamodb/batch_write.js
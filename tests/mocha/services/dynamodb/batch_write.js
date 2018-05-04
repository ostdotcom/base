/* global describe, it */

const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , helper = require(rootPrefix + '/tests/mocha/services/dynamodb/helper')
  , testDataSource = require(rootPrefix + '/tests/mocha/services/dynamodb/testdata/batch_get_write_data')
;

var dynamoDBApi = null;

describe('Batch write', function () {
  before(async function() {
    this.timeout(100000);
    // get dynamoDB API object
    dynamoDBApi = helper.getDynamoDBApiObject(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS);

    // check if table exists
    const checkTableExistsResponse = await dynamoDBApi.checkTableExist(testDataSource.DELETE_TABLE_DATA);
    if (checkTableExistsResponse.data.response === true) {
      // delete if table exists
      await helper.deleteTable(dynamoDBApi,testDataSource.DELETE_TABLE_DATA, true);
    }

    // create table for the test
    await helper.createTable(dynamoDBApi,testDataSource.CREATE_TABLE_DATA, true);

  });

  it('should fail batch write when number of items = 0', async function () {
    this.timeout(100000);

    const batchWriteParams = testDataSource.getBatchWriteData(0);
    await  helper.performBatchWriteTest(dynamoDBApi, batchWriteParams ,false);

  });

  it('should pass batch write when number of items = 1', async function () {
    this.timeout(100000);

    const batchWriteParams = testDataSource.getBatchWriteData(1);
    const batchWriteResponse = await  helper.performBatchWriteTest(dynamoDBApi, batchWriteParams ,true);
    assert.empty(batchWriteResponse.data.UnprocessedItems);

  });

  it('should pass batch write when number of items = 5', async function () {
    this.timeout(100000);

    const batchWriteParams = testDataSource.getBatchWriteData(5);
    const batchWriteResponse = await  helper.performBatchWriteTest(dynamoDBApi, batchWriteParams ,true);
    assert.empty(batchWriteResponse.data.UnprocessedItems);

  });
  it('should pass batch write when number of items = 25', async function () {
    this.timeout(100000);

    const batchWriteParams = testDataSource.getBatchWriteData(25);
    const batchWriteResponse = await  helper.performBatchWriteTest(dynamoDBApi, batchWriteParams ,true);
    assert.empty(batchWriteResponse.data.UnprocessedItems);

  });
  it('should fail batch write when number of items > 25', async function () {
    this.timeout(100000);

    const batchWriteParams = testDataSource.getBatchWriteData(26);
    await  helper.performBatchWriteTest(dynamoDBApi, batchWriteParams ,false);

  });

  // size related tests

  after(async function() {
    this.timeout(100000);
    // runs after all tests in this block
    await helper.deleteTable(dynamoDBApi,testDataSource.DELETE_TABLE_DATA, true);
  });

});



// mocha tests/mocha/services/dynamodb/
// mocha tests/mocha/services/dynamodb/batch_write.js
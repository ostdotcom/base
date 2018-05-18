/* global describe, it */

const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , helper = require(rootPrefix + '/tests/mocha/services/dynamodb/helper')
  , testDataSource = require(rootPrefix + '/tests/mocha/services/dynamodb/testdata/batch_get_write_data')
;

var dynamoDBApi = null;

describe('Batch get', function () {
  before(async function() {
    this.timeout(100000);

    // get dynamoDB API object
    dynamoDBApi = helper.validateDynamodbApiObject(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS);

    // check if table exists
    const checkTableExistsResponse = await dynamoDBApi.checkTableExist(testDataSource.DELETE_TABLE_DATA);
    if (checkTableExistsResponse.data.response === true) {
      // delete if table exists
      await helper.deleteTable(dynamoDBApi,testDataSource.DELETE_TABLE_DATA, true);
    }

    // create table for the test
    await helper.createTable(dynamoDBApi,testDataSource.CREATE_TABLE_DATA, true);

    // populate test data
    const batchWriteParams = testDataSource.getBatchWriteDataBasedOnParam(4);
    await  helper.performBatchWriteTest(dynamoDBApi, batchWriteParams ,true);

  });

  it('batch get happy case', async function () {
    this.timeout(100000);
    const bachGetParams = {
      RequestItems: {
        [testConstants.transactionLogsTableName]: {
          Keys: [
            {
              "tuid": {
                S: "tuid_1"
              },
              "cid": {
                N: "1"
              }
            },
            {
              "tuid": {
                S: "tuid_2"
              },
              "cid": {
                N: "2"
              }
            },
            {
              "tuid": {
                S: "tuid_3"
              },
              "cid": {
                N: "3"
              }
            }
          ]
        }
      }
    };
    let returnCount = 3;
    await  helper.performBatchGetTest(dynamoDBApi, bachGetParams , true, returnCount);
  });


  it('batch get partial valid cases', async function () {
    this.timeout(100000);
    const bachGetParams = {
      RequestItems: {
        [testConstants.transactionLogsTableName]: {
          Keys: [
            {
              "tuid": {
                S: "tuid_1"
              },
              "cid": {
                N: "1"
              }
            },
            {
              "tuid": {
                S: "tuid_2"
              },
              "cid": {
                N: "2"
              }
            },
            {
              "tuid": {
                S: "tuid_5"
              },
              "cid": {
                N: "5"
              }
            }
          ]
        }
      }
    };
    let returnCount = 2;
    await  helper.performBatchGetTest(dynamoDBApi, bachGetParams , true, returnCount);
  });

  it('batch get zero keys', async function () {
    this.timeout(100000);
    const bachGetParams = {
      RequestItems: {
        [testConstants.transactionLogsTableName]: {
          Keys: [
          ]
        }
      }
    };
    let returnCount = 0;
    await  helper.performBatchGetTest(dynamoDBApi, bachGetParams , false, returnCount);
  });

  it('batch get none key match keys', async function () {
    this.timeout(100000);
    const bachGetParams = {
      RequestItems: {
        [testConstants.transactionLogsTableName]: {
          Keys: [
            {
              "tuid": {
                S: "tuid_5"
              },
              "cid": {
                N: "5"
              }
            }
          ]
        }
      }
    };
    let returnCount = 0;
    await  helper.performBatchGetTest(dynamoDBApi, bachGetParams , true, returnCount);
  });

  after(function() {
    // runs after all tests in this block
    console.log('after function called');
  });

});



// mocha tests/mocha/services/dynamodb/
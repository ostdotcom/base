/* global describe, it */

const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , testConstants = require(rootPrefix + '/tests/mocha/services/dynamodb/constants')
  , helper = require(rootPrefix + '/tests/mocha/services/dynamodb/helper')
;

var dynamoDBApi = null;

describe('Batch get', function () {
  before(async function() {
    this.timeout(100000);

    dynamoDBApi = helper.getDynamoDBApiObject(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS);

/*
    // build create table params
    const createTableParams = {
      TableName : "Movies4",
      KeySchema: [
        { AttributeName: "year", KeyType: "HASH"},  //Partition key
        { AttributeName: "title", KeyType: "RANGE" }  //Sort key
      ],
      AttributeDefinitions: [
        { AttributeName: "year", AttributeType: "N" },
        { AttributeName: "title", AttributeType: "S" }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      }
    };

    // move this call to helper
    // call create table.
    const createTableResponse = await dynamoDBApi.createTable(createTableParams);

    // validate if the table is created
    assert.isTrue(createTableResponse.isSuccess(), 'Create table failed');
*/

    var tableExistsParams = { TableName: 'Movies1'};
    var tableExistsResponse = await  dynamoDBApi.checkTableExistsWithWaitFor(tableExistsParams);
    console.log('tableExistsResponse: ',JSON.stringify(tableExistsResponse));

/*
    tableExistsParams = { TableName: 'Movies10'};
    tableExistsResponse = await  dynamoDBApi.checkTableExistsWithWaitFor(tableExistsParams);
    console.log('tableExistsResponse: ',JSON.stringify(tableExistsResponse));
*/


    tableNotExistsParams = { TableName: 'Movies15'};
    tableNotExistsResponse = await  dynamoDBApi.checkTableNotExistsWithWaitFor(tableNotExistsParams);
    console.log('tableNotExistsResponse: ',JSON.stringify(tableNotExistsResponse));

/*
    tableNotExistsParams = { TableName: 'Movies1'};
    tableNotExistsResponse = await  dynamoDBApi.checkTableNotExistsWithWaitFor(tableNotExistsParams);
    console.log('tableNotExistsResponse: ',JSON.stringify(tableNotExistsResponse));
*/

    // load test data in the table

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
/* global describe, it */

const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , api = require(rootPrefix + '/services/dynamodb/api')
  , testConstants = require(rootPrefix + '/tests/mocha/services/dynamodb/constants')
;

var dynamoDBApi = null;

describe('Batch get', function () {
  before(async function() {
    this.timeout(100000);

    // validate if the default dynamodb configuration exists
    assert.exists(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS, 'testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS is neither `null` nor `undefined`');

    // create dynamoDBApi object
    dynamoDBApi = new api(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS);

    // validate if the dynamoDBApi object is created
    assert.exists(dynamoDBApi, 'dynamoDBApi is not created');

    // build create table params
    const createTableParams = {
      TableName : "Movies1",
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

    // call create table.
    const createTableResponse = await dynamoDBApi.createTable(createTableParams);

    console.log("createTableResponse: ",createTableResponse);
    // validate if the table is created
    assert.isTrue(createTableResponse.isSuccess(), 'Create table failed');


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
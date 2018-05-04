const chai = require('chai')
  , assert = chai.assert;

//Load external files
const rootPrefix = "../../../.."
  , DdbApiKlass = require(rootPrefix + '/services/dynamodb/api')
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , helper = require(rootPrefix + "/tests/mocha/services/dynamodb/helper")
;

describe('Query Table', function() {

  var dynamodbApiObject = null;

  before(async function() {
    // create dynamoDbApiObject
    dynamodbApiObject = new DdbApiKlass(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS);
    helper.validateDynamodbApiObject(dynamodbApiObject);

    // put item
    const createTableParams = {
      TableName : testConstants.transactionLogsTableName,
      KeySchema: [
        {
          AttributeName: "tuid",
          KeyType: "HASH"
        },  //Partition key
        {
          AttributeName: "cid",
          KeyType: "RANGE"
        }  //Sort key
      ],
      AttributeDefinitions: [
        { AttributeName: "tuid", AttributeType: "S" },
        { AttributeName: "cid", AttributeType: "N" }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    };
    await helper.createTable(dynamodbApiObject, createTableParams, true);

    const insertItemParams = {
      TableName: testConstants.transactionLogsTableName,
      Item: {
        tuid: {S: "shardTableName"},
        cid: {N: "2"},
        C: {S: String(new Date().getTime())},
        U: {S: String(new Date().getTime())}
      }
    };
    await helper.putItem(dynamodbApiObject, insertItemParams, true);

  });

  it('query table for item successfully', async function () {
    const queryParams = {
      TableName: testConstants.transactionLogsTableName,
        ExpressionAttributeValues: {
          ":v1": {
            S: 'shardTableName'
          },
          ":v2": {
            N: '2'
          }
        },
        KeyConditionExpression: "#id = :v1 AND #cid = :v2",
        ExpressionAttributeNames: {"#id": 'tuid', "#cid": 'cid'}
    };
    const resultCount = 1;
    const response = await helper.query(dynamodbApiObject, queryParams, true, resultCount);
  });

  it('query table for item with invalid key successfully', async function () {
    const queryParams = {
      TableName: testConstants.transactionLogsTableName,
      ExpressionAttributeValues: {
        ":v1": {
          S: 'shardTable'
        },
        ":v2": {
          N: '2'
        }
      },
      KeyConditionExpression: "#id = :v1 AND #cid = :v2",
      ExpressionAttributeNames: {"#id": 'tuid', "#cid": 'cid'}
    };

    const resultCount = 0;
    const response = await helper.query(dynamodbApiObject, queryParams, true, resultCount);
  });

  it('query table for item with key only without using sort key unsuccessfully', async function () {
    const queryParams = {
      TableName: testConstants.transactionLogsTableName,
      ExpressionAttributeValues: {
        ":v1": {
          S: 'shardTable'
        }
      },
      KeyConditionExpression: "#id = :v1",
      ExpressionAttributeNames: {"#id": 'tuid'}
    };

    const resultCount = 0;
    const response = await helper.query(dynamodbApiObject, queryParams, true, resultCount);
  });

  it('query table for item with invalid table name unsuccessfully', async function () {
    const queryParams = {
      TableName: 'invalidTable',
      ExpressionAttributeValues: {
        ":v1": {
          S: 'shardTable'
        },
        ":v2": {
          N: '2'
        }
      },
      KeyConditionExpression: "#id = :v1 AND #cid = :v2",
      ExpressionAttributeNames: {"#id": 'tuid', "#cid": 'cid'}
    };

    const resultCount = 0;
    const response = await helper.query(dynamodbApiObject, queryParams, false, resultCount);
  });

  after(async function() {
    const deleteTableParams = {
      TableName: testConstants.transactionLogsTableName
    };
    await helper.deleteTable(dynamodbApiObject, deleteTableParams, true);
    logger.debug("Update Table Mocha Tests Complete");
  });
});
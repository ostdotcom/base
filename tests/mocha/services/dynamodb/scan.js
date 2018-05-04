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

describe('Scan Table', function() {

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

    const insertItem1Params = {
      TableName: testConstants.transactionLogsTableName,
      Item: {
        tuid: {S: "shardTableName1"},
        cid: {N: "1"},
        C: {S: String(new Date().getTime())},
        U: {S: String(new Date().getTime())}
      }
    };
    await helper.putItem(dynamodbApiObject, insertItem1Params, true);

    const insertItem2Params = {
      TableName: testConstants.transactionLogsTableName,
      Item: {
        tuid: {S: "shardTableName2"},
        cid: {N: "2"},
        C: {S: String(new Date().getTime())},
        U: {S: String(new Date().getTime())}
      }
    };
    await helper.putItem(dynamodbApiObject, insertItem2Params, true);

  });

  it('scan table for items successfully', async function () {
    const queryParams = {
      TableName: testConstants.transactionLogsTableName,
      ExpressionAttributeValues: {
        ":v1": {
          S: 'shardTableName1'
        },
        ":v2": {
          N: '1'
        }
      },
      FilterExpression: "#id = :v1 AND #cid = :v2",
      ExpressionAttributeNames: {"#id": 'tuid', "#cid": 'cid'}
    };

    const resultCount = 1;
    const response = await helper.scan(dynamodbApiObject, queryParams, true, resultCount);
  });

  it('scan table for item with invalid key successfully', async function () {
    const queryParams = {
      TableName: testConstants.transactionLogsTableName,
      ExpressionAttributeValues: {
        ":v1": {
          S: 'shardTableNae1'
        },
        ":v2": {
          N: '1'
        }
      },
      FilterExpression: "#id = :v1 AND #cid = :v2",
      ExpressionAttributeNames: {"#id": 'tuid', "#cid": 'cid'}
    };

    const resultCount = 0;
    const response = await helper.scan(dynamodbApiObject, queryParams, true, resultCount);
  });

  it('scan table for item with key only without using sort key successfully', async function () {
    const queryParams = {
      TableName: testConstants.transactionLogsTableName,
      ExpressionAttributeValues: {
        ":v1": {
          S: 'shardTableName1'
        }
      },
      FilterExpression: "#id = :v1",
      ExpressionAttributeNames: {"#id": 'tuid'}
    };

    const resultCount = 1;
    const response = await helper.scan(dynamodbApiObject, queryParams, true, resultCount);
  });

  it('scan table for item with invalid table name unsuccessfully', async function () {
    const queryParams = {
      TableName: 'invalidTable',
      ExpressionAttributeValues: {
        ":v1": {
          S: 'shardTableName1'
        },
        ":v2": {
          N: '1'
        }
      },
      FilterExpression: "#id = :v1 AND #cid = :v2",
      ExpressionAttributeNames: {"#id": 'tuid', "#cid": 'cid'}
    };

    const resultCount = 0;
    const response = await helper.scan(dynamodbApiObject, queryParams, false, resultCount);
  });

  after(async function() {
    const deleteTableParams = {
      TableName: testConstants.transactionLogsTableName
    };
    await helper.deleteTable(dynamodbApiObject, deleteTableParams, true);
    logger.debug("Update Table Mocha Tests Complete");
  });
});
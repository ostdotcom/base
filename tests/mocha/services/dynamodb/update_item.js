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

describe('Update Item in Table', function() {

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

  it('should update item successfully', async function () {
    const updateItemParam = {
      ExpressionAttributeNames: {
        "#c": 'C'
      },
      ExpressionAttributeValues: {
        ":t": {
          S: "2342"
        }
      },
        Key: {
          tuid: {
            S: 'shardTableName'
          },
          cid: {
            N: "2"
          }
        },
      ReturnValues: "ALL_NEW",
      TableName: testConstants.transactionLogsTableName,
      UpdateExpression: "SET #c = :t"
    };

    await helper.updateItem(dynamodbApiObject, updateItemParam, true);
  });

  it('update item should be unsuccessfully when key type is invalid', async function () {
    const updateItemParam = {
      ExpressionAttributeNames: {
        "#c": 'C'
      },
      ExpressionAttributeValues: {
        ":t": {
          C: "2342"
        }
      },
      Key: {
        tuid: {
          S: 'shardTableName'
        },
        cid: {
          S: "2"
        }
      },
      ReturnValues: "ALL_NEW",
      TableName: testConstants.transactionLogsTableName,
      UpdateExpression: "SET #c = :t"
    };

    await helper.updateItem(dynamodbApiObject, updateItemParam, false);
  });

  after(async function() {
    const deleteTableParams = {
      TableName: testConstants.transactionLogsTableName
    };
    await helper.deleteTable(dynamodbApiObject, deleteTableParams, true);
    logger.debug("Update Table Mocha Tests Complete");
  });
});
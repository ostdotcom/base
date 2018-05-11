const chai = require('chai')
  , assert = chai.assert;

//Load external files
const rootPrefix = "../../../.."
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , helper = require(rootPrefix + "/tests/mocha/services/dynamodb/helper")
;

describe('Delete Item', function() {

  var dynamodbApiObject = null;

  before(async function() {
    // get dynamodbApiObject
    dynamodbApiObject = helper.validateDynamodbApiObject(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS);

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
  });

  it('should delete item successfully', async function () {

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

    const deleteItemParams = {
      TableName: testConstants.transactionLogsTableName,
      Key: {
        "tuid": {
          S: "shardTableName"
        },
        "cid": {
          N: "2"
        }
      }
    };
    await helper.deleteItem(dynamodbApiObject, deleteItemParams, true);
  });

  it('should delete item successfully with unknown key', async function () {

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

    const deleteItemParams = {
      TableName: testConstants.transactionLogsTableName,
      Key: {
        "tuid": {
          S: "shardTable"
        },
        "cid": {
          N: "2"
        }
      }
    };
    await helper.deleteItem(dynamodbApiObject, deleteItemParams, true);
  });

  it('should delete item unsuccessfully with invalid table name', async function () {


    const deleteItemParams = {
      TableName: "InvalidTableName",
      Key: {
        "tuid": {
          S: "shardTableName"
        },
        "cid": {
          N: "2"
        }
      }
    };
    await helper.deleteItem(dynamodbApiObject, deleteItemParams, false);
  });


  after(async function() {
    const deleteTableParams = {
      TableName: testConstants.transactionLogsTableName
    };
    await helper.deleteTable(dynamodbApiObject, deleteTableParams, true);
    logger.debug("Update Table Mocha Tests Complete");
  });


});

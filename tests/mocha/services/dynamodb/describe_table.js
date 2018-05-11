const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , helper = require(rootPrefix + "/tests/mocha/services/dynamodb/helper")
;

describe('Describe Dynamodb Table', function() {

  var dynamodbApiObject = null;

  before(async function() {
    // create dynamodbApiObject
    // get dynamodbApiObject
    dynamodbApiObject = helper.validateDynamodbApiObject(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS);
  });

  it('should create table successfully', async function () {
    // build create table params
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
        { AttributeName: "cid", AttributeType: "N" },
        { AttributeName: "thash", AttributeType: "S" }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'thash_global_secondary_index',
          KeySchema: [
            {
              AttributeName: 'thash',
              KeyType: "HASH"
            }
          ],
          Projection: {
            ProjectionType: "KEYS_ONLY"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        },
      ],
      SSESpecification: {
        Enabled: false
      },
    };
    await helper.createTable(dynamodbApiObject, createTableParams, true);
  });

  it('should describe table successfully', async function () {
    const describeTableParams = {
      TableName: testConstants.transactionLogsTableName
    };
    await helper.describeTable(dynamodbApiObject, describeTableParams, true);
  });

  it('should fail when table name is not passed', async function () {
    const describeTableParams = {};
    await helper.describeTable(dynamodbApiObject, describeTableParams, false);
  });


  after(async function() {
    // build delete table params
    const deleteTableParams = {
      TableName: testConstants.transactionLogsTableName
    };

    await helper.deleteTable(dynamodbApiObject, deleteTableParams, true);
    logger.debug("Update Table Mocha Tests Complete");
  });


});

const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , DdbApiKlass = require(rootPrefix + '/services/dynamodb/api')
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , helper = require(rootPrefix + "/tests/mocha/services/dynamodb/helper")
;

describe('Create Table', function() {

  var dynamodbApiObject = null;

  before(async function() {

    // create dynamodbApiObject
    dynamodbApiObject = new DdbApiKlass(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS);
    helper.validateDynamodbApiObject(dynamodbApiObject);
  });

  it('should delete table successfully if exists', async function () {
    const params = {
      TableName: testConstants.transactionLogsTableName
    };
    const checkTableExistsResponse = await dynamodbApiObject.checkTableExists(params);
    if (checkTableExistsResponse.data.response === true) {
      await helper.deleteTable(dynamodbApiObject, params, true);
    }
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

  it('create table should fail when table name is not passed', async function () {
    // build create table params
    const createTableParams = {
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
    await helper.createTable(dynamodbApiObject, createTableParams, false);
  });

  // it('should enable continous backup successfully', async function () {
  //   // build create table params
  //   const enableContinousBackupParams = {
  //     TableName: testConstants.transactionLogsTableName,
  //     PointInTimeRecoverySpecification: {
  //       PointInTimeRecoveryEnabled: true
  //     }
  //   };
  //   await helper.updateContinuousBackup(dynamodbApiObject, enableContinousBackupParams);
  // });

  after(async function() {
    const params = {
      TableName: testConstants.transactionLogsTableName
    };
    await helper.deleteTable(dynamodbApiObject, params, true);

    logger.debug("Create Table Mocha Tests Complete");
  });


});

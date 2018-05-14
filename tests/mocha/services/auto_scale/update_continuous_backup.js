const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , DdbApiKlass = require(rootPrefix + "/index").Dynamodb
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , helper = require(rootPrefix + "/tests/mocha/services/dynamodb/helper")
;

describe('Create Table', function() {

  var dynamodbApiObject = null;

  before(async function() {

    // create dynamodbApiObject
    dynamodbApiObject = new DdbApiKlass(testConstants.DYNAMODB_CONFIGURATIONS_REMOTE);
    helper.validateDynamodbApiObject(dynamodbApiObject);
  });

  it('should delete table successfully if exists', async function () {
    this.timeout(100000);
    const params = {
      TableName: testConstants.transactionLogsTableName
    };
    const checkTableExistsResponse = await dynamodbApiObject.checkTableExist(params);
    if (checkTableExistsResponse.data.response === true) {
      await helper.deleteTable(dynamodbApiObject, params, true);
    }
  });

  it('should create table successfully', async function () {
    this.timeout(100000);
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
    const params = {
      TableName: testConstants.transactionLogsTableName
    };
  });

  it('should enable update continuous backup successfully', async function () {
    // build update continuous params
    const enableContinousBackupParams = {
      TableName: testConstants.transactionLogsTableName,
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true
      }
    };
    await helper.updateContinuousBackup(dynamodbApiObject, enableContinousBackupParams, true);
  });

  it('should fail enable update continuous backup if table name not present', async function () {
    // build update continuous params
    const enableContinousBackupParams = {
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true
      }
    };
    await helper.updateContinuousBackup(dynamodbApiObject, enableContinousBackupParams, false);
  });

  after(async function() {
    const params = {
      TableName: testConstants.transactionLogsTableName
    };
    await helper.deleteTable(dynamodbApiObject, params, true);

    logger.debug("Create Table Mocha Tests Complete");
  });


});

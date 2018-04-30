const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , DdbApiKlass = require(rootPrefix + '/services/dynamodb/api')
  , testConstants = require(rootPrefix + '/tests/mocha/services/dynamodb/constants')
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
;

describe('Create Table', function() {

  var dynamodbApiObject = null;
  const tableName = "shard_00001_transaction_logs";

  before(async function() {

    // create dynamodbApiObject
    dynamodbApiObject = new DdbApiKlass(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS);

    // validate if the dynamodbApiObject object is created
    assert.exists(dynamodbApiObject, 'dynamodbApiObject is not created');

  });

  it('should create table successfully', async function () {
    this.timeout(10000);
    // build create table params
    const createTableParams = {
      TableName : tableName,
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
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
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
    const createTableResponse = await dynamodbApiObject.createTable(createTableParams);
    assert.equal(createTableResponse.isSuccess(), true);

  });

  // it('should enable continous backup successfully', async function () {
  //   // build create table params
  //   const enableContinousBackupParams = {
  //     TableName: tableName,
  //     PointInTimeRecoverySpecification: {
  //       PointInTimeRecoveryEnabled: true
  //     }
  //   };
  //   const enableContinousResponse = await dynamodbApiObject.updateContinuousBackup(enableContinousBackupParams);
  //   assert.equal(enableContinousResponse.isSuccess(), true);
  // });

  after(function() {
    logger.debug("Create Table Mocha Tests Complete");
  });


});

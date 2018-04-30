const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , DdbApiKlass = require(rootPrefix + '/services/dynamodb/api')
  , testConstants = require(rootPrefix + '/tests/mocha/services/dynamodb/constants')
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , helper = require(rootPrefix + "/tests/mocha/services/dynamodb/helper")
;

describe('Delete Table', function() {

  var dynamodbApiObject = null;

  before(async function() {
    // create dynamodbApiObject
    dynamodbApiObject = new DdbApiKlass(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS);
    helper.assertDynamodbApiObject(dynamodbApiObject);
  });

  it('should delete table successfully if exists', async function () {
    // build create table params
    const deleteTableParams = {
      TableName: testConstants.transactionLogsTableName
    };

    await helper.deleteTable(dynamodbApiObject, deleteTableParams);
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
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      SSESpecification: {
        Enabled: false
      },
    };
    await helper.createTable(dynamodbApiObject, createTableParams);
  });

  it('should update table successfully', async function () {
    // build create table params
    const updateTableParams = {
      TableName: testConstants.transactionLogsTableName,
      GlobalSecondaryIndexUpdates: [
        {
          Create: {
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
          }
        }
      ]
    };
    await helper.updateTable(dynamodbApiObject, updateTableParams);
  });

  after(function() {
    logger.debug("Update Table Mocha Tests Complete");
  });


});

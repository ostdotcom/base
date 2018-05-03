"use strict";

// Load external packages
const Chai = require('chai')
  , assert = Chai.assert
;

// Load dependencies package
const rootPrefix = "../../../.."
  , DynamoDbObject = require(rootPrefix + "/index").DynamoDb
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
;

const dynamoDbObject = new DynamoDbObject(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS)
  , shardManagementService = dynamoDbObject.shardManagement()
  , MANAGED_SHARD_TABLE = 'ManagedShard'
  , AVAILABLE_SHARD_TABLE = 'AvailableShard'
  , createTableParamsFor = function (tableName) {
  return {
    TableName: tableName,
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
      {AttributeName: "tuid", AttributeType: "S"},
      {AttributeName: "cid", AttributeType: "N"}
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }
};

const createTestCasesForOptions = function (optionsDesc, options, toAssert) {
  optionsDesc = optionsDesc || "";
  options = options || {
    availableShard: false,
    managedShard: false
  };

  it(optionsDesc, async function () {
    if (options.availableShard) {
      await dynamoDbObject.createTable(createTableParamsFor(AVAILABLE_SHARD_TABLE));
    }

    if (options.managedShard) {
      await dynamoDbObject.createTable(createTableParamsFor(MANAGED_SHARD_TABLE));
    }

    const response = await shardManagementService.runShardMigration();
    if (toAssert) {
      assert.isTrue(response.isSuccess(), "Success");
    } else {
      assert.isTrue(response.isFailure(), "Failure");
    }
  });
};

describe('lib/services/shard_management/shard_migration', function () {

  beforeEach(async function () {

    // delete table
    await dynamoDbObject.deleteTable({
      TableName: MANAGED_SHARD_TABLE
    });

    await dynamoDbObject.deleteTable({
      TableName: AVAILABLE_SHARD_TABLE
    });

  });

  createTestCasesForOptions("Shard migration happy case",{}, true);
  createTestCasesForOptions("Shard migration available shard table already exists", {
    availableShard: true
  }, false);
  createTestCasesForOptions("Shard migration managed shared table already exists", {
    managedShard: true
  }, false);
  createTestCasesForOptions("Shard migration managed and available share both table already exists", {
    availableShard: true,
    managedShard: true
  }, false);
});
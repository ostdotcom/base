"use strict";

// Load external packages
const Chai = require('chai')
  , assert = Chai.assert
;

// Load dependencies package
const rootPrefix = "../../../.."
  , DynamoDbKlass = require(rootPrefix + "/index").Dynamodb
  , AutoScaleApiKlass = require(rootPrefix + "/index").AutoScaling
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , availableShardConst = require(rootPrefix + "/lib/global_constant/available_shard")
  , managedShardConst = require(rootPrefix + "/lib/global_constant/managed_shard")
;

const dynamoDbObject = new DynamoDbKlass(testConstants.DYNAMODB_CONFIGURATIONS_REMOTE)
  , autoScaleObj = new AutoScaleApiKlass(testConstants.AUTO_SCALE_CONFIGURATIONS_REMOTE)
  , shardManagementObject = dynamoDbObject.shardManagement()
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
    this.timeout(10000000);
    console.log("deleting tables");
    let checkTableExistsResponse = await dynamoDbObject.checkTableExist({TableName: managedShardConst.getTableName()});
    if (checkTableExistsResponse.data.response === true) {
      await dynamoDbObject.deleteTable({
        TableName: managedShardConst.getTableName()
      });
    }

    checkTableExistsResponse = await dynamoDbObject.checkTableExist({TableName: availableShardConst.getTableName()});
    if (checkTableExistsResponse.data.response === true) {
      await dynamoDbObject.deleteTable({
        TableName: availableShardConst.getTableName()
      });
    }

    console.log("starting runShardMigration");
    const response = await shardManagementObject.runShardMigration(dynamoDbObject, autoScaleObj);
    if (toAssert) {
      assert.isTrue(response.isSuccess(), "Success");
    } else {
      assert.isTrue(response.isFailure(), "Failure");
    }
  });
};

describe('lib/services/shard_management/shard_migration', function () {

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
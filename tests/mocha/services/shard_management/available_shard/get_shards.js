"use strict";

// Load external packages
const Chai    = require('chai')
  , assert    = Chai.assert
;

const rootPrefix = "../../../../.."
  , DynamoDbObject = require(rootPrefix + "/index").DynamoDb
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , managedShardConst = require(rootPrefix + "/lib/global_constant/managed_shard")
  , availableShardConst = require(rootPrefix + "/lib/global_constant/available_shard")
;


const dynamoDbObject = new DynamoDbObject(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS)
  , shardManagementService = dynamoDbObject.shardManagement()
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
    invalidShardType: false,
  };
  let entity_type = 'userBalances';

  it(optionsDesc, async function(){
    let shardType = availableShardConst.disabled;
    if (options.invalidShardType) {
      shardType = "test"
    }
    const response = await shardManagementService.getShardsByType({entity_type: entity_type, shard_type: shardType});

    logger.log("LOG", response);
    if (toAssert) {
      assert.isTrue(response.isSuccess(), "Success");
      assert.equal(response.data.Count, 1);
    } else {
      assert.isTrue(response.isFailure(), "Failure");
    }
  });

};

describe('services/shard_management/available_shard/get_shards', function () {

  before(async function () {

    // delete table
    await dynamoDbObject.deleteTable({
      TableName: managedShardConst.getTableName()
    });

    await dynamoDbObject.deleteTable({
      TableName: availableShardConst.getTableName()
    });

    await shardManagementService.runShardMigration();

    let entity_type = 'userBalances';
    let schema = createTableParamsFor("test");

    // delete table
    await dynamoDbObject.deleteTable({
      TableName: 'shard_00001_userBalances'
    });

    let shardName = "shard_00001_userBalances";
    await shardManagementService.addShard({shard_name: shardName, entity_type: entity_type, table_schema: schema});
  });

  createTestCasesForOptions("Get shards adding happy case", {}, true);

  createTestCasesForOptions("Get shards having invalid shard type", {
    invalidShardType: true
  }, false);
});
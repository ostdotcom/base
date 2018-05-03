"use strict";

// Load external packages
const Chai    = require('chai')
  , assert    = Chai.assert
;

const rootPrefix = "../../../../.."
  , DynamoDbObject = require(rootPrefix + "/index").DynamoDb
  , testConstants = require(rootPrefix + '/tests/mocha/services/dynamodb/constants')
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , managedShardConst = require(rootPrefix + "/lib/global_constant/managed_shard")
  , availableShardConst = require(rootPrefix + "/lib/global_constant/available_shard")
;


const dynamoDbObject = new DynamoDbObject(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS)
  , shardManagementService = dynamoDbObject.shardManagement()
  , identifier = '0x1234'
  , shardName = "shard_00001_userBalances"
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



const createTestCasesForOptions = function (optionsDesc, options, toAssert, returnCount) {
  optionsDesc = optionsDesc || "";
  options = options || {
    inValidEntityType: false,
    inValidId: false
  };
  let entity_type = 'userBalances';
  let id = identifier;

  it(optionsDesc, async function(){

    if (options.inValidEntityType) {
      entity_type = "userPrice";
    }

    if (options.inValidId) {
      id = "0x2";
    }

    const response = await shardManagementService.getShard({identifier: id, entity_type: entity_type});

    logger.log("shardManagementService Response", JSON.stringify(response));
    if (toAssert) {
      assert.isTrue(response.isSuccess(), "Success");
      assert.equal(response.data.Count, returnCount);
      if (returnCount === 1){
        assert.equal(response.data.Items[0][managedShardConst.SHARD_NAME]['S'], shardName);
      }
    } else {
      assert.isTrue(response.isFailure(), "Failure");
    }
  });

};

describe('services/dynamodb/shard_management/managed_shard/get_shard', function () {

  before(async function () {

    // delete table
    await dynamoDbObject.deleteTable({
      TableName: managedShardConst.getTableName()
    });

    await dynamoDbObject.deleteTable({
      TableName: availableShardConst.getTableName()
    });

    await shardManagementService.runShardMigration();

  });

  beforeEach(async function (){

    await dynamoDbObject.deleteTable({
      TableName: 'shard_00001_userBalances'
    });
    let schema = createTableParamsFor("test");
    await shardManagementService.addShard({shard_name: shardName, entity_type: 'userBalances', table_schema: schema});

    await shardManagementService.assignShard({identifier: identifier, entity_type: "userBalances" ,shard_name: shardName});
  });

  createTestCasesForOptions("Get shard happy case", {}, true, 1);

  createTestCasesForOptions("Get shard having invalid shard type", {
    inValidEntityType: true
  }, false, 1);

  createTestCasesForOptions("Get shard having invalid Id", {
    inValidId: true
  }, true, 0);
});
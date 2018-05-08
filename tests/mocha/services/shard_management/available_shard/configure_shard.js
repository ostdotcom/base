"use strict";

// Load external packages
const Chai    = require('chai')
  , assert    = Chai.assert
;

// Load dependencies package
const rootPrefix = "../../../../.."
  , DynamoDbObject = require(rootPrefix + "/index").DynamoDb
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , managedShardConst = require(rootPrefix + "/lib/global_constant/managed_shard")
  , availableShardConst = require(rootPrefix + "/lib/global_constant/available_shard")
  , helper = require(rootPrefix + "/tests/mocha/services/shard_management/helper")
;


const dynamoDbObject = new DynamoDbObject(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS)
  , shardManagementService = dynamoDbObject.shardManagement()
  ;

const createTestCasesForOptions = function (optionsDesc, options, toAssert) {
  optionsDesc = optionsDesc || "";
  options = options || {
    emptyShardName: false,
    invalidAllocationType: false,
  };


  it(optionsDesc, async function(){
    let shardName = "shard_00001_userBalances"
      , allocation = availableShardConst.getShardTypes()[availableShardConst.all];

    if (options.emptyShardName) {
      shardName = "";
    }
    if (options.invalidAllocationType) {
      allocation = "invalid";
    }
    const response = await shardManagementService.configureShard({shard_name: shardName, enable_allocation: allocation});

    logger.log("LOG", response);
    if (toAssert) {
      assert.isTrue(response.isSuccess(), "Success");
    } else {
      assert.isTrue(response.isFailure(), "Failure");
    }
  });
};

describe('services/shard_management/available_shard/configure_shard', function () {

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
    let schema = helper.createTableParamsFor("test");

    // delete table
    await dynamoDbObject.deleteTable({
      TableName: 'shard_00001_userBalances'
    });

    let shardName = "shard_00001_userBalances";
    await shardManagementService.addShard({shard_name: shardName, entity_type: entity_type, table_schema: schema});
  });


  createTestCasesForOptions("Configuring shard happy case", {},true);

  createTestCasesForOptions("Configuring shard adding empty shard name", {
    emptyShardName: true
  }, false);

  createTestCasesForOptions("Configuring shard having invalid allocation type", {
    invalidAllocationType: true
  }, false);
});
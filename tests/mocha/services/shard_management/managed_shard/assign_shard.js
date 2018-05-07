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
  , helper = require(rootPrefix + "/tests/mocha/services/shard_management/helper")
;


const dynamoDbObject = new DynamoDbObject(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS)
  , shardManagementService = dynamoDbObject.shardManagement()
  , userBalancesShardName = 'shard_00001_userBalances'
;


const createTestCasesForOptions = function (optionsDesc, options, toAssert) {
  optionsDesc = optionsDesc || "";
  options = options || {
    invalidShardName: false,
  };
  let shardName = userBalancesShardName
    , identifier = "0x1234"
    , entityType = "userBalances"
  ;

  it(optionsDesc, async function(){

    if (options.invalidShardName) {
      // delete table
      await dynamoDbObject.deleteTable({
        TableName: managedShardConst.getTableName()
      });

      await dynamoDbObject.deleteTable({
        TableName: availableShardConst.getTableName()
      });

      await shardManagementService.runShardMigration();
    }

    const response = await shardManagementService.assignShard({identifier: identifier, entity_type: entityType, shard_name: shardName});

    logger.log("LOG", response);
    if (toAssert) {
      assert.isTrue(response.isSuccess(), "Success");
    } else {
      assert.isTrue(response.isFailure(), "Failure");
    }
  });

};

describe('services/dynamodb/shard_management/managed_shard/assign_shard', function () {

  beforeEach(async function() {

    // delete table
    await dynamoDbObject.deleteTable({
      TableName: managedShardConst.getTableName()
    });

    await dynamoDbObject.deleteTable({
      TableName: availableShardConst.getTableName()
    });

    await shardManagementService.runShardMigration();

    // delete table
    await dynamoDbObject.deleteTable({
      TableName: 'shard_00001_userBalances'
    });

    let schema = helper.createTableParamsFor("test");
    await shardManagementService.addShard({shard_name: userBalancesShardName, entity_type: 'userBalances', table_schema: schema});
  });

  createTestCasesForOptions("Assign shard adding happy case", {}, true);

  createTestCasesForOptions("Assign shard having invalid shard name", {
    invalidShardName: true
  }, false);
});
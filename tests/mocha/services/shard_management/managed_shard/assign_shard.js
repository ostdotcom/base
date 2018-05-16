"use strict";

// Load external packages
const Chai    = require('chai')
  , assert    = Chai.assert
;

const rootPrefix = "../../../../.."
  , DynamoDbObject = require(rootPrefix + "/index").Dynamodb
  , AutoScaleApiKlass = require(rootPrefix + "/index").AutoScaling
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , managedShardConst = require(rootPrefix + "/lib/global_constant/managed_shard")
  , availableShardConst = require(rootPrefix + "/lib/global_constant/available_shard")
  , helper = require(rootPrefix + "/tests/mocha/services/shard_management/helper")
;


const dynamoDbObject = new DynamoDbObject(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS)
  , autoScaleObj = new AutoScaleApiKlass(testConstants.AUTO_SCALE_CONFIGURATIONS_REMOTE)
  , shardManagementObject = dynamoDbObject.shardManagement()
  , userBalancesShardName = testConstants.shardTableName
;


const createTestCasesForOptions = function (optionsDesc, options, toAssert) {
  optionsDesc = optionsDesc || "";
  options = options || {
    invalidShardName: false,
    undefined_force_assignment: true
  };
  let shardName = userBalancesShardName
    , identifier = "0x1234"
    , entityType = testConstants.shardEntityType
    , forceAssignment = true
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

      await shardManagementObject.runShardMigration(dynamoDbObject, autoScaleObj);
    }

    if (options.undefined_force_assignment) {
      forceAssignment = false;
    }

    const response = await shardManagementObject.assignShard({identifier: identifier, entity_type: entityType, shard_name: shardName, force_assignment: true});

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

    await shardManagementObject.runShardMigration(dynamoDbObject, autoScaleObj);

    // delete table
    await dynamoDbObject.deleteTable({
      TableName: testConstants.shardTableName
    });

    let schema = helper.createTableParamsFor("test");
    await shardManagementObject.addShard({shard_name: userBalancesShardName, entity_type: 'userBalances', table_schema: schema});
  });

  createTestCasesForOptions("Assign shard adding happy case", {}, true);

  createTestCasesForOptions("Assign shard having invalid shard name", {
    invalidShardName: true
  }, false);

  createTestCasesForOptions("Assign shard having undefined force assignment", {
    undefined_force_assignment: true
  }, true);
});
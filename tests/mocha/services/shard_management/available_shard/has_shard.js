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
  , shardName = testConstants.shardTableName

;

const createTestCasesForOptions = function (optionsDesc, options, toAssert) {
  optionsDesc = optionsDesc || "";
  options = options || {
    hasShard: true,
  };

  it(optionsDesc, async function(){

    if (!options.hasShard) {
      // delete table
      await dynamoDbObject.deleteTable({
        TableName: shardName
      });
    }
    const response = await shardManagementObject.hasShard({shard_names: [shardName]});

    logger.log("LOG", response);
    assert.isTrue(response.isSuccess(), "Success");
    assert.exists(response.data[shardName].has_shard);
    if (toAssert) {
      assert.isTrue(response.data[shardName].has_shard);
    } else {
      assert.isFalse(response.data[shardName].has_shard);
    }
  });
};

describe('services/dynamodb/shard_management/available_shard/has_shard', function () {

  before(async function () {

    // delete table
    await dynamoDbObject.deleteTable({
      TableName: managedShardConst.getTableName()
    });

    await dynamoDbObject.deleteTable({
      TableName: availableShardConst.getTableName()
    });

    await shardManagementObject.runShardMigration(dynamoDbObject, autoScaleObj);

    let entity_type = testConstants.shardEntityType;
    let schema = helper.createTableParamsFor("test");

    // delete table
    await dynamoDbObject.deleteTable({
      TableName: shardName
    });

    await shardManagementObject.addShard({shard_name: shardName, entity_type: entity_type, table_schema: schema});
  });

  createTestCasesForOptions("has shard case", {}, true);

  createTestCasesForOptions("does not have shard case", {
    hasShard: false
  }, true);
});
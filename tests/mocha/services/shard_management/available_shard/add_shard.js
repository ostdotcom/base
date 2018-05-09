"use strict";

// Load external packages
const Chai = require('chai')
  , assert = Chai.assert
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
    wrongEntityType: false,
    invalidSchema: false,
    corruptSchema: false
  };

  it(optionsDesc, async function () {
    let shardName = "shard_00001_userBalances";
    let entity_type = 'userBalances';
    let schema = helper.createTableParamsFor("test");
    if (options.wrongEntityType) {
      entity_type = '';
    }
    if (options.invalidSchema) {
      schema = {};
    }
    const response = await shardManagementService.addShard({shard_name: shardName ,entity_type: entity_type, table_schema: schema});
    logger.log("LOG", response);
    if (toAssert) {
      assert.isTrue(response.isSuccess(), "Success");
    } else {
      assert.isTrue(response.isFailure(), "Failure");
    }
  });

};

describe('services/shard_management/available_shard/add_shard', function () {
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

  beforeEach(async function () {

    // delete table
    await dynamoDbObject.deleteTable({
      TableName: 'shard_00001_userBalances'
    });
  });

  createTestCasesForOptions("Shard adding happy case", {}, true);

  createTestCasesForOptions("Shard adding empty shard name", {
    wrongEntityType: true
  }, false);

  createTestCasesForOptions("Shard adding having invalid schema", {
    invalidSchema: true
  }, false);
});
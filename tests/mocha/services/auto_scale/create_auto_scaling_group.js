"use strict";

// Load external packages
const Chai = require('chai')
  , assert = Chai.assert
;

// Load dependencies package
const rootPrefix = "../../../.."
  , DynamoDbObject = require(rootPrefix + "/index").DynamoDb
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
;

const dynamoDbObject = new DynamoDbObject(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS)
;

const createTestCasesForOptions = function(optionsDesc, options, toAssert) {
  optionsDesc = optionsDesc || "";

  it(optionsDesc, async function () {
    var params = {
      ServiceNamespace: "dynamodb"
    };
    const response = await dynamoDbObject.createAutoScalingGroup(params);
    logger.log(response);
    assert.isTrue(response.isSuccess());
  });
};

describe('services/auto_scale/api', function () {

  createTestCasesForOptions("Add auto scaling group", {}, true);
});
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

const dynamoDbObject = new DynamoDbObject(testConstants.DYNAMODB_CONFIGURATIONS_2)
;

const createTestCasesForOptions = function(optionsDesc, options, toAssert) {
  optionsDesc = optionsDesc || "";

  it(optionsDesc, async function () {
    var params = {
      AutoScalingGroupName: "my-auto-scaling-group",
      AvailabilityZones: [
        "us-east-1"
      ],
      HealthCheckGracePeriod: 120,
      HealthCheckType: "ELB",
      LaunchConfigurationName: "my-launch-config",
      LoadBalancerNames: [
        "my-load-balancer"
      ],
      MaxSize: 3,
      MinSize: 1
    };
    const response = await dynamoDbObject.createAutoScalingGroup(params);
    logger.log(response);
    assert.isTrue(response.isSuccess());
  });
};

describe('services/auto_scale/api', function () {

  createTestCasesForOptions("Add auto scaling group", {}, true);
});
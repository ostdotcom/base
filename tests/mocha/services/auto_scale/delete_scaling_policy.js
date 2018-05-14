"use strict";

// Load external packages
const Chai = require('chai')
  , assert = Chai.assert
;

// Load dependencies package
const rootPrefix = "../../../.."
  , ApplicationAutoScalingKlass = require(rootPrefix + "/index").AutoScaling
  , DdbApiKlass = require(rootPrefix + "/index").Dynamodb
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , helper = require(rootPrefix + "/tests/mocha/services/auto_scale/helper")
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
;

const autoScaleObj = new ApplicationAutoScalingKlass(testConstants.AUTO_SCALE_CONFIGURATIONS_REMOTE)
  , dynamodbApiObject = new DdbApiKlass(testConstants.DYNAMODB_CONFIGURATIONS_REMOTE)
;

let resourceId = 'table/' + testConstants.transactionLogsTableName
  , roleARN = null;

const createTestCasesForOptions = function(optionsDesc, options, toAssert) {
  optionsDesc = optionsDesc || "";

  options = options || {invalid_policy_name : false};

  it(optionsDesc, async function () {
    this.timeout(100000);

    let policyName = testConstants.transactionLogsTableName + "-scaling-policy";
    if (options.invalid_policy_name) {
      policyName = "invalidPolicyId"
    } else {

      const scalableTargetParams = {
        ResourceId: resourceId, /* required */
        ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
        ServiceNamespace: 'dynamodb', /* required */
        MaxCapacity: 15,
        MinCapacity: 1,
        RoleARN: roleARN

      };
      const registerScalableTargetResponse = await autoScaleObj.registerScalableTarget(scalableTargetParams);
      assert.equal(registerScalableTargetResponse.isSuccess(), true, 'registerScalableTarget failed');

      const scalingPolicy = {
        ServiceNamespace: "dynamodb",
        ResourceId: "table/" + testConstants.transactionLogsTableName,
        ScalableDimension: "dynamodb:table:WriteCapacityUnits",
        PolicyName: policyName,
        PolicyType: "TargetTrackingScaling",
        TargetTrackingScalingPolicyConfiguration: {
          PredefinedMetricSpecification: {
            PredefinedMetricType: "DynamoDBWriteCapacityUtilization"
          },
          ScaleOutCooldown: 60,
          ScaleInCooldown: 60,
          TargetValue: 70.0
        }
      };
      const putScalingPolicyResponse = await autoScaleObj.putScalingPolicy(scalingPolicy);
      assert.equal(putScalingPolicyResponse.isSuccess(), true, 'putScalingPolicy failed');
    }

    const params = {
      PolicyName: testConstants.transactionLogsTableName + "-scaling-policy",
      ResourceId: "table/" + testConstants.transactionLogsTableName,
      ScalableDimension: "dynamodb:table:WriteCapacityUnits",
      ServiceNamespace: "dynamodb"
    };

    const response = await autoScaleObj.deleteScalingPolicy(params);

    logger.log(response);
    assert.equal(response.isSuccess(), toAssert, 'describeScalingPolicies failed');
  });
};

describe('services/auto_scale/api#deleteScalingPolicy', function () {

  before(async function() {
    this.timeout(1000000);

    const returnObject = await helper.createTestCaseEnvironment(dynamodbApiObject, autoScaleObj);
    roleARN = returnObject.role_arn;

  });

  createTestCasesForOptions("Delete scaling policy happy case", null, true);

  createTestCasesForOptions("Delete scaling policy having policy name case", {invalid_policy_name : true}, false);

  after(async function() {
    this.timeout(1000000);
    await helper.cleanTestCaseEnvironment(dynamodbApiObject, autoScaleObj);
  });

});
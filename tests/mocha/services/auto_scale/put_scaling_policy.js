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

  options = options || {invalidResId : false};

  it(optionsDesc, async function () {
    this.timeout(100000);

    let resId = "table/" + testConstants.transactionLogsTableName;
    if (options.invalidResId) {
      resId = "invalidResId"
    }

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

    let scalingPolicy = null;
    if (options.stepScaling) {
       scalingPolicy = {
        PolicyName: testConstants.transactionLogsTableName + "-scaling-policy",
        PolicyType: "StepScaling",
        ResourceId: resId,
        ScalableDimension: "dynamodb:table:WriteCapacityUnits",
        ServiceNamespace: "dynamodb",
        StepScalingPolicyConfiguration: {
          AdjustmentType: "PercentChangeInCapacity",
          Cooldown: 60,
          StepAdjustments: [
            {
              MetricIntervalLowerBound: 0,
              ScalingAdjustment: 80
            }
          ]
        }
      };
    } else {
      scalingPolicy = {
        ServiceNamespace: "dynamodb",
        ResourceId: resId,
        ScalableDimension: "dynamodb:table:WriteCapacityUnits",
        PolicyName: testConstants.transactionLogsTableName + "-scaling-policy",
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
    }
    const response = await autoScaleObj.putScalingPolicy(scalingPolicy);

    logger.log(response);
    assert.equal(response.isSuccess(), toAssert, 'put Scaling policy failed');
  });
};

describe('services/auto_scale/api#putScalingPolicy', function () {

  before(async function() {
    this.timeout(1000000);

    const returnObject = await helper.createTestCaseEnvironment(dynamodbApiObject, autoScaleObj);
    roleARN = returnObject.role_arn;

  });

  createTestCasesForOptions("Put scaling policy happy case", null, true);

  createTestCasesForOptions("Put scaling policy invalid resource Id case", {invalidResId : true}, false);

  // TODO test case for step scaling
  //createTestCasesForOptions("Put scaling policy having step scaling ", {stepScaling : true}, true);

  after(async function() {
    this.timeout(1000000);
    await helper.cleanTestCaseEnvironment(dynamodbApiObject, autoScaleObj);
  });

});
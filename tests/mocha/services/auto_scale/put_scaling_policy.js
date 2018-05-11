"use strict";

// Load external packages
const Chai = require('chai')
  , assert = Chai.assert
;

// Load dependencies package
const rootPrefix = "../../../.."
  , ApplicationAutoScalingKlass = require(rootPrefix + "/services/auto_scale/api.js")
  , DdbApiKlass = require(rootPrefix + '/services/dynamodb/api')
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , helper = require(rootPrefix + "/tests/mocha/services/auto_scale/helper")
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
;

const autoScaleObj = new ApplicationAutoScalingKlass(testConstants.AUTO_SCALE_CONFIGURATIONS_PROD)
  , dynamodbApiObject = new DdbApiKlass(testConstants.DYNAMODB_CONFIGURATIONS_PROD)
;

let resourceId = 'table/' + testConstants.transactionLogsTableName
  , roleARN = null;

// TODO it's not using roleARN here
// TODO define scalable target policy
// TODO put scaling policy for StepScaling needed
const createTestCasesForOptions = function(optionsDesc, options, toAssert) {
  optionsDesc = optionsDesc || "";

  options = options || {invalidResId : false};

  it(optionsDesc, async function () {
    this.timeout(100000);

    let resId = "table/" + testConstants.transactionLogsTableName;
    if (options.invalidResId) {
      resId = "invalidResId"
    }

    const scalingPolicy = {
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

  after(async function() {
    this.timeout(1000000);
    await helper.cleanTestCaseEnvironment(dynamodbApiObject, autoScaleObj);
  });

});
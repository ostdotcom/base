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

  options = options || {invalid_service_name : false};

  it(optionsDesc, async function () {
    this.timeout(100000);

    let serviceNameSpace = "dynamodb";
    if (options.invalid_service_name) {
      serviceNameSpace = "invalidResId"
    }

    const scalingPolicy = {
      ServiceNamespace: "dynamodb",
      ResourceId: "table/" + testConstants.transactionLogsTableName,
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
    const putScalingPolicyResponse = await autoScaleObj.putScalingPolicy(scalingPolicy);
    assert.equal(putScalingPolicyResponse.isSuccess(), true, 'putScalingPolicy failed');

    const params = {
      ServiceNamespace: serviceNameSpace
    };

    const response = await autoScaleObj.describeScalingPolicies(params);

    logger.log(response);
    assert.equal(response.isSuccess(), toAssert, 'describeScalingPolicies failed');
  });
};

describe('services/auto_scale/api#describeScalingPolicies', function () {

  before(async function() {
    this.timeout(1000000);

    const returnObject = await helper.createTestCaseEnvironment(dynamodbApiObject, autoScaleObj);
    roleARN = returnObject.role_arn;

  });

  createTestCasesForOptions("Describe scaling policy happy case", null, true);

  createTestCasesForOptions("Describe scaling policy having invalid name case", {invalid_service_name : true}, false);

  after(async function() {
    this.timeout(1000000);
    await helper.cleanTestCaseEnvironment(dynamodbApiObject, autoScaleObj);
  });

});
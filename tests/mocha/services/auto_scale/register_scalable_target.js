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

const createTestCasesForOptions = function(optionsDesc, options, toAssert) {
  optionsDesc = optionsDesc || "";

  options = options || {invalidARN : false};
  it(optionsDesc, async function () {
    this.timeout(100000);
    let arn = roleARN;
    if (options.invalidARN) {
      arn = 'invalidArn';
    }
    const params = {
      ResourceId: resourceId, /* required */
      ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
      ServiceNamespace: 'dynamodb' , /* required */
      MaxCapacity: 15,
      MinCapacity: 1,
      RoleARN: arn

    };
    const response = await autoScaleObj.registerScalableTarget(params);
    logger.log(response);
    assert.equal(response.isSuccess(), toAssert, "Not able to register Scalable Target");
  });
};

describe('services/auto_scale/api#registerScalableTarget', function () {

  before(async function() {
    this.timeout(1000000);

    const returnObject = await helper.createTestCaseEnvironment(dynamodbApiObject, autoScaleObj);
    roleARN = returnObject.role_arn;
  });

  createTestCasesForOptions("Register scalable target happy case", null, true);

  createTestCasesForOptions("Register scalable target with wrong arn", {invalidARN : true}, false);

  after(async function(){
    this.timeout(1000000);

    await helper.cleanTestCaseEnvironment(dynamodbApiObject, autoScaleObj);
  });

});
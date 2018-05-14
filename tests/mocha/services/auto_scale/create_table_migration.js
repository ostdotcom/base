const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , DdbApiKlass = require(rootPrefix + "/index").Dynamodb
  , AutoScaleKlass =require(rootPrefix + "/index").AutoScaling
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , helper = require(rootPrefix + "/tests/mocha/services/auto_scale/helper")
;

describe('Create Table', function() {

  var dynamodbApiObject = null;
  var autoScaleObj = null;

  before(async function() {

    // create dynamodbApiObject
    dynamodbApiObject = new DdbApiKlass(testConstants.DYNAMODB_CONFIGURATIONS_REMOTE);
    autoScaleObj = new AutoScaleKlass(testConstants.AUTO_SCALE_CONFIGURATIONS_REMOTE);

    const oThis = this
      , params = {
      TableName: testConstants.transactionLogsTableName
    };

    const checkTableExistsResponse1 = await dynamodbApiObject.checkTableExist(params);

    if (checkTableExistsResponse1.data.response === true) {

      logger.log(testConstants.transactionLogsTableName, "Table exists . Deleting it....");
      await helper.deleteTable(dynamodbApiObject, params, true);

      logger.info("Waiting for table to get deleted");
      await helper.waitForTableToGetDeleted(dynamodbApiObject, params);
      logger.info("Table got deleted");
    } else {
      logger.log(testConstants.transactionLogsTableName, "Table does not exist.");
    }
  });

  it('should create table successfully', async function () {
    // build create table params

    const response = await helper.createTableMigration(dynamodbApiObject, autoScaleObj);
    assert.isTrue(response.isSuccess(), "createTableMigration failed");

  });

  after(async function() {
    const params = {
      TableName: testConstants.transactionLogsTableName
    };
    await helper.deleteTable(dynamodbApiObject, params, true);

    logger.debug("Create Table Mocha Tests Complete");

    logger.log("Waiting for Table get deleted...............");
    await helper.waitForTableToGetDeleted(dynamodbApiObject, params);

  });


});

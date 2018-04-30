const chai = require('chai')
  , assert = chai.assert;

const rootPrefix = "../../../.."
  , DdbApiKlass = require(rootPrefix + '/services/dynamodb/api')
  , testConstants = require(rootPrefix + '/tests/mocha/services/dynamodb/constants')
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , helper = require(rootPrefix + "/tests/mocha/services/dynamodb/helper")
;

describe('Delete Table', function() {

  var dynamodbApiObject = null;

  before(async function() {

    // create dynamodbApiObject
    dynamodbApiObject = new DdbApiKlass(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS);
    helper.validateDynamodbApiObject(dynamodbApiObject);

  });

  it('should delete table successfully', async function () {
    // build create table params
    const deleteTableParams = {
      TableName: testConstants.transactionLogsTableName
    };

    await helper.deleteTable(dynamodbApiObject, deleteTableParams);
  });

  after(function() {
    logger.debug("Delete Table Mocha Tests Complete");
  });


});

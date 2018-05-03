const chai = require('chai')
  , assert = chai.assert;

//Load external files
const rootPrefix = "../../../.."
  , DdbApiKlass = require(rootPrefix + '/services/dynamodb/api')
  , testConstants = require(rootPrefix + '/tests/mocha/services/constants')
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
  , helper = require(rootPrefix + "/tests/mocha/services/dynamodb/helper")
;

describe('Check table exists', function() {

  var dynamodbApiObject = null;

  before(async function() {
    // create dynamoDbApiObject
    dynamodbApiObject = new DdbApiKlass(testConstants.DYNAMODB_DEFAULT_CONFIGURATIONS);
    helper.validateDynamodbApiObject(dynamodbApiObject);

    // put item
    const createTableParams = {
      TableName : testConstants.transactionLogsTableName,
      KeySchema: [
        {
          AttributeName: "tuid",
          KeyType: "HASH"
        },  //Partition key
        {
          AttributeName: "cid",
          KeyType: "RANGE"
        }  //Sort key
      ],
      AttributeDefinitions: [
        { AttributeName: "tuid", AttributeType: "S" },
        { AttributeName: "cid", AttributeType: "N" }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    };
    await helper.createTable(dynamodbApiObject, createTableParams, true);
  });

  it('check table exist successfully', async function () {
    const response = await dynamodbApiObject.checkTableExist({TableName: testConstants.transactionLogsTableName});
    assert.equal(response.isSuccess(), true, 'check table exist failed');
  });

  it('check table exist unsuccessfully', async function () {
    const response = await dynamodbApiObject.checkTableExist({TableName: 'unKnown_Table'});
    assert.equal(response.isSuccess(), true, 'check table exist failed');
  });

  after(async function() {
    const deleteTableParams = {
      TableName: testConstants.transactionLogsTableName
    };
    await helper.deleteTable(dynamodbApiObject, deleteTableParams, true);
    logger.debug("Update Table Mocha Tests Complete");
  });
});
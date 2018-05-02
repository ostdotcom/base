
"use strict";

/**
 * Load all the test data for batch write and batch get
 *
 * @module tests/mocha/services/dynamodb/testdata/batch_get_write_data
 *
 */

/**
 * Constructor for test data
 *
 * @constructor
 */
const TestData = function() {};

TestData.prototype = {

  /**
   * Create table data
   *
   * @constant {object}
   *
   */
  CREATE_TABLE_DATA : {
    TableName : "transaction_logs",
    KeySchema: [
      { AttributeName: "year", KeyType: "HASH"},  //Partition key
      { AttributeName: "title", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "year", AttributeType: "N" },
      { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  },


};

module.exports = new TestData();



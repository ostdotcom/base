
"use strict";

/**
 * Load all the test data for batch write and batch get
 *
 * @module tests/mocha/services/dynamodb/testdata/batch_get_write_data
 *
 */

const rootPrefix = '../../../../..'
  , testConstants = require(rootPrefix + '/tests/mocha/services/dynamodb/constants')
;

/**
 * Constructor for test data
 *
 * @constructor
 */
const TestData = function() {};

var cid = 0;
var tuid = `tuid_${cid}`;
var thash = `thash${cid}`;

const tableName = testConstants.transactionLogsTableName;

TestData.prototype = {

  TABLE_NAME: tableName,

  /**
   * Create table data
   *
   * @constant {object}
   *
   */
  CREATE_TABLE_DATA : {
    TableName : tableName,
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
      { AttributeName: "cid", AttributeType: "N" },
      { AttributeName: "thash", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: 'thash_global_secondary_index',
        KeySchema: [
          {
            AttributeName: 'thash',
            KeyType: "HASH"
          }
        ],
        Projection: {
          ProjectionType: "KEYS_ONLY"
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        }
      },
    ],
    SSESpecification: {
      Enabled: false
    },
  },

  DELETE_TABLE_DATA: {
    TableName : tableName
  },

  getBatchWritedata: function (numberOfItems) {

    const data = [];
    for(var i=0; i<numberOfItems; i++) {

      cid++;
      tuid = `tuid_${cid}`;
      thash = `thash${cid}`;


      let item = {};
      item.tuid = {
        "S": tuid
      };
      item.cid = {
        "N": cid
      };
      item.thash = {
        "S": thash
      };

      data.push({'PutRequest': {"Item": item}});
    }

    return data;
  }
};

module.exports = new TestData();



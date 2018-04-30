
"use strict";

/**
 * Load all the constants from the mocha tests
 *
 * @module tests/mocha/services/dynamodb/constants
 *
 */

/**
 * Constructor for mocha test constants
 *
 * @constructor
 */
const MochaTestConstants = function() {};

MochaTestConstants.prototype = {

  /**
   * DynamoDB default configuration
   *
   * @constant {object}
   *
   */
  DYNAMODB_DEFAULT_CONFIGURATIONS : {
    'maxRetries': 10,
    'apiVersion': '2012-08-10',
    'accessKeyId': '',
    'secretAccessKey': '',
    'region': 'localhost',
    'logger': console,
    'sslEnabled': false,
    'endpoint': "http://localhost:8000"
  },

  /**
   * DynamoDB configuration 1
   *
   * @constant {object}
   *
   */
  DYNAMODB_CONFIGURATIONS_1 : {
    'maxRetries': 10,
    'apiVersion': '2012-08-10',
    'accessKeyId': '',
    'secretAccessKey': '',
    'region': 'localhost',
    'logger': console,
    'sslEnabled': false,
    'endpoint': "http://localhost:8000"
  },

  transactionLogsTableName: 'shard_00001_transaction_logs'


};

module.exports = new MochaTestConstants();



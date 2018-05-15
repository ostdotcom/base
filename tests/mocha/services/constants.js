
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
    'apiVersion': '2012-08-10',
    'accessKeyId': 'x',
    'secretAccessKey': 'x',
    'region': 'localhost',
    'logger': console,
    'sslEnabled': false,
    'endpoint': "http://localhost:8000"
  },

  /**
   * DynamoDB AWS Account configuration
   *
   * @constant {object}
   *
   */
  DYNAMODB_CONFIGURATIONS_REMOTE : {
    'apiVersion': '2012-08-10',
    'accessKeyId': 'AKIAJ6YMLEN7A7DQWGPQ',
    'secretAccessKey': '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',
    'region': 'us-east-1',
    'logger': console,
    'sslEnabled': false,
    'endpoint': "http://dynamodb.us-east-1.amazonaws.com"
  },

  /**
   * auto scale configuration
   *
   * @constant {object}
   *
   */
  AUTO_SCALE_CONFIGURATIONS_REMOTE : {
    'apiVersion': '2016-02-06',
    'accessKeyId': 'AKIAJ6YMLEN7A7DQWGPQ',
    'secretAccessKey': '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',
    'region': 'us-east-1',
    'logger': console,
    'sslEnabled': false,
    'endpoint': "http://autoscaling.us-east-1.amazonaws.com"
  },

  transactionLogsTableName: 'shard_00001_transaction_logs'

};

module.exports = new MochaTestConstants();



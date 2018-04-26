"use strict";

/**
 * DynamoDB Create Table Librarie class
 *
 * @module lib/dynamodb/create_table
 *
 */

const rootPrefix  = "../.."
  , AWS = require('aws-sdk')
  , coreConstants = require(rootPrefix+'config/core_constants')
  , base = require(rootPrefix+'config/base')
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
  , responseHelper = require(rootPrefix+'/lib/formatter/response')
;

/**
 * Constructor for create table class
 *
 * @constructor
 */
// auto scale
const CreateTable = function(params) {
  const oThis = this
  ;
  oThis.tableName = params.table_name;
  oThis.enableServerSideEncryption = params.enable_server_side_encryption || false;
  // [
  //   {
  //     AttributeName: 'STRING_VALUE', /* required */
  //     AttributeType: S | N | B /* required */
  //   },
  // ]
  oThis.attributeDefinitions = params.attribute_definitions;
  // [
  //   {
  //     AttributeName: 'STRING_VALUE', /* required */
  //     KeyType: HASH | RANGE /* required */
  //   },
  //   /* more items */
  //  ]
  oThis.keySchema = params.primary_key;


};

CreateTable.prototype = {

  /**
   * Perform method
   *
   * @return {promise<result>}
   *
   */
  perform: async function () {
    const oThis = this
    ;
    try {
      var r = null;

      r = oThis.validateParams();
      logger.debug("=======createTable.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await oThis.create();
      logger.debug("=======createTable.create.result=======");
      logger.debug(r);
      return r;
    } catch(err) {
      return responseHelper.error('l_dy_ct_perform_1', 'Something went wrong. ' + err.message);
    }

  },

  /**
   * Validation of params
   *
   * @return {promise<result>}
   *
   */
  validateParams: function () {
    const oThis = this
    ;

  },

  /**
   * Run the register
   *
   * @return {promise<result>}
   *
   */
  create: function () {
    const oThis = this
    ;
    return new Promise(function (onResolve, onReject) {
      var params = {
        AttributeDefinitions: oThis.attributeDefinitions,
        KeySchema: oThis.keySchema,
        // ProvisionedThroughput: { /* required */
        //   ReadCapacityUnits: 0, /* required */
        //   WriteCapacityUnits: 0 /* required */
        // },
        TableName: oThis.tableName, /* required */
        GlobalSecondaryIndexes: [
          {
            IndexName: 'STRING_VALUE', /* required */
            KeySchema: [ /* required */
              {
                AttributeName: 'STRING_VALUE', /* required */
                KeyType: HASH | RANGE /* required */
              },
              /* more items */
            ],
            Projection: { /* required */
              NonKeyAttributes: [
                'STRING_VALUE',
                /* more items */
              ],
              ProjectionType: ALL | KEYS_ONLY | INCLUDE
            },
            ProvisionedThroughput: { /* required */
              ReadCapacityUnits: 0, /* required */
              WriteCapacityUnits: 0 /* required */
            }
          },
          /* more items */
        ],
        LocalSecondaryIndexes: [
          {
            IndexName: 'STRING_VALUE', /* required */
            KeySchema: [ /* required */
              {
                AttributeName: 'STRING_VALUE', /* required */
                KeyType: HASH | RANGE /* required */
              },
              /* more items */
            ],
            Projection: { /* required */
              NonKeyAttributes: [
                'STRING_VALUE',
                /* more items */
              ],
              ProjectionType: ALL | KEYS_ONLY | INCLUDE
            }
          },
          /* more items */
        ],
        SSESpecification: {
          Enabled: oThis.enableServerSideEncryption /* required */
        }
      };
      dynamodb.createTable(params, function(err, data) {
        if (err) {
          onResolve(responseHelper.errorWithData({error: err.stack}, "l_dy_ct_create_1", "Error in Creating table"));
        }
        else {
          console.log(data);           // successful response
          onResolve(responseHelper.successWithData({data: data}));
        }
      });
    });

  }

};

module.exports = CreateTable;
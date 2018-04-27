"use strict";

/**
 * DynamoDB Create Table Librarie class
 *
 * @module lib/dynamodb/create_table
 *
 */

const rootPrefix  = "../.."
  , coreConstants = require(rootPrefix+'config/core_constants')
  , Core = require(rootPrefix+'config/core')
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
  , responseHelper = require(rootPrefix+'/lib/formatter/response')
;

/**
 * Constructor for create table class
 *
 * @constructor
 */
// TODO auto scale
// TODO Validations https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html#limits-tables
const CreateTable = function(params) {
  const oThis = this
  ;
  oThis.tableName = params.table_name;
  oThis.enableServerSideEncryption = params.enable_server_side_encryption || false;
  oThis.keySchema = params.primary_index;
  oThis.attributeDefinitions = params.attribute_definitions;
  oThis.globalSecondaryIndexes = params.global_secondary_indexes || [];
  oThis.localSecondaryIndexes = params.local_secondary_indexes || [];

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

    if (!oThis.tableName) {
      return responseHelper.error('l_dy_ct_validateParams_1', 'Table name is mandatory');
    }

    if (oThis.tableName.length < 3 || oThis.tableName.length > 255) {
      return responseHelper.error('l_dy_ct_validateParams_1', 'Invalid table name length');
    }
    // Attribute
    // Global Secondary index validations
    // Local secondary index validations
  },

  /**
   * Create DynamoDB Table
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
        GlobalSecondaryIndexes: oThis.globalSecondaryIndexes,
        LocalSecondaryIndexes: oThis.localSecondaryIndexes,
        SSESpecification: {
          Enabled: oThis.enableServerSideEncryption /* required */
        }
      };
      Core.getInstance().createTable(params, function(err, data) {
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
"use strict";

/**
 * DynamoDB create table migration having multiple services
 *  1. Create table
 *  2. Check active table status
 *  2. Enable continuous back up
 *  3. Enable auto scaling
 *
 * @module services/dynamodb/create_table_migration
 *
 */

const rootPrefix  = "../.."
  , DDBServiceBaseKlass = require(rootPrefix + "/services/dynamodb/base")
  , ResponseHelperKlass = require(rootPrefix + '/lib/formatter/response')
  , responseHelper = new ResponseHelperKlass({module_name: "TableExist"})
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
;

/**
 * Constructor for TableExist service class
 *
 * @params {object} ddbObject - DynamoDB Object
 * @params {object} params - CreateTableMigration params
 * @params {object} params.auto_scale_object - auto scale object
 * @params {string} TableName - name of table
 *
 * @constructor
 */
const CreateTableMigration = function(ddbObject, params) {
  const oThis = this
  ;
  oThis.autoScaleObject = params.auto_scale_object;
  DDBServiceBaseKlass.call(oThis, ddbObject, 'createTableMigration', params);
};

CreateTableMigration.prototype = Object.create(DDBServiceBaseKlass.prototype);

const CreateTableMigrationPrototype = {

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
      logger.debug("=======TableExist.validateParams.result=======");
      logger.debug(r);
      if (r.isFailure()) return r;

      r = await oThis.checkTableExist();
      logger.debug("=======TableExist.checkTableExist.result=======");
      logger.debug(r);
      return r;
    } catch (err) {
      logger.error("services/dynamodb/table_exists.js:perform inside catch ", err);
      return responseHelper.error('s_dy_te_perform_1', 'Something went wrong. ' + err.message);
    }
  },

  /**
   * Validation of params
   *
   * @return {result}
   *
   */
  validateParams: function () {
    const oThis = this
      , baseValidationResponse = DDBServiceBaseKlass.prototype.validateParams.call(oThis)
    ;
    if (baseValidationResponse.isFailure()) return baseValidationResponse;

    if (!oThis.params.TableName) return responseHelper.error('l_dy_te_validateParams_1', 'TableName is mandatory');

    return responseHelper.successWithData({});
  },

  /**
   * run create table migration
   *
   * @params {object} params
   *
   * @return {Promise} true/false
   *
   */
  executeDdbRequest: function() {
    const oThis = this
      , registerAutoScalePromiseArray = []
      , putAutoScalePolicyArray = []
    ;
    return new Promise(async function (onResolve) {

      logger.info("Creating table..");
      const createTableResponse = await oThis.ddbObject.call('createTable', oThis.params);
      if(createTableResponse.isFailure()){
        throw "Failure in table creation"
      }

      const roleARN = createTableResponse.data.TableDescription.TableArn;
      logger.debug("Table arn :", roleARN);

      logger.info("Waiting for table creation..");
      const responseOfWaitFor = await oThis.ddbObject.call('waitFor','tableExists', params);
      if(responseOfWaitFor.isFailure()){
        throw "Failure in wait for"
      }

      logger.info("Enable continuous backup..");
      const continuousBackupResponse = await oThis.ddbObject.call('updateContinuousBackups', params);
      if(continuousBackupResponse.isFailure()){
        throw "Failure in continuousBackupResponse"
      }

      logger.info("Register auto scaling target..");
      registerAutoScalePromiseResponse.push(oThis.autoScaleObject.registerScalableTarget(param1));
      registerAutoScalePromiseResponse.push(oThis.autoScaleObject.registerScalableTarget(param2));

      const registerAutoScalePromiseResponse = await Promise.all(registerAutoScalePromiseArray);
      if (registerAutoScalePromiseResponse[0].isFailure() || registerAutoScalePromiseResponse[1].isFailure()) {
        throw "Failure in register auto scale promise array"
      }

      logger.info("Putting auto scale policy..");
      putAutoScalePolicyArray.push(oThis.autoScaleObject.putScalingPolicy(param1));
      putAutoScalePolicyArray.push(oThis.autoScaleObject.putScalingPolicy(param2));

      const putAutoScalePolicyPromiseResponse = await Promise.all(putAutoScalePolicyArray);
      if (putAutoScalePolicyPromiseResponse[0].isFailure() || putAutoScalePolicyPromiseResponse[1].isFailure()) {
        throw "Failure in put auto scale policy promise array"
      }

      onResolve(data)
    });
  },

};

Object.assign(CreateTableMigration.prototype, CreateTableMigrationPrototype);
CreateTableMigration.prototype.constructor = CreateTableMigration;
module.exports = CreateTableMigration;
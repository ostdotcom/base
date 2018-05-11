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
 * @params {object} params - params
 * @params {object} params.createTableConfig - create table configurations
 * @params {object} params.updateContinuousBackupConfig - update Continuous Backup configurations
 * @params {object} params.autoScalingConfig - scaling params
 * @params {object} params.autoScalingConfig.registerScalableTargetWrite - register Scalable Target write configurations
 * @params {object} params.autoScalingConfig.registerScalableTargetRead - register Scalable Target read configurations
 * @params {object} params.autoScalingConfig.putScalingPolicyWrite- Put scaling policy write configurations
 * @params {object} params.autoScalingConfig.putScalingPolicyRead - Put scaling policy read configurations
 *
 * @constructor
 */
const CreateTableMigration = function(ddbObject, params) {
  const oThis = this
  ;
  oThis.createTableConfig = params.createTableConfig;
  oThis.updateContinuousBackupConfig = params.updateContinuousBackupConfig;
  oThis.autoScalingConfig = params.autoScalingConfig;

  DDBServiceBaseKlass.call(oThis, ddbObject, 'createTableMigration', params);
};

CreateTableMigration.prototype = Object.create(DDBServiceBaseKlass.prototype);

const CreateTableMigrationPrototype = {

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

    if (!oThis.params.createTableConfig) {
      return responseHelper.error('l_dy_ctm_validateParams_1', 'create table config is mandatory');
    }

    if (!oThis.params.updateContinuousBackupConfig) {
      return responseHelper.error('l_dy_ctm_validateParams_2', 'updateContinuousBackupConfig config is mandatory');
    }

    if (!oThis.params.autoScalingConfig){
      return responseHelper.error('l_dy_ctm_validateParams_3', 'auto scaling configs are mandatory');
    }

    if (!oThis.params.autoScalingConfig.registerScalableTargetWrite){
      return responseHelper.error('l_dy_ctm_validateParams_4', 'auto scaling registerScalableTargetWrite config is mandatory');
    }

    if (!oThis.params.autoScalingConfig.registerScalableTargetRead){
      return responseHelper.error('l_dy_ctm_validateParams_5', 'auto scaling registerScalableTargetRead config is mandatory');
    }

    if (!oThis.params.autoScalingConfig.putScalingPolicyWrite){
      return responseHelper.error('l_dy_ctm_validateParams_6', 'auto scaling putScalingPolicyWrite config is mandatory');
    }

    if (!oThis.params.autoScalingConfig.putScalingPolicyRead){
      return responseHelper.error('l_dy_ctm_validateParams_7', 'auto scaling putScalingPolicyRead config is mandatory');
    }

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
      ;
    return new Promise(async function (onResolve) {

      logger.info("Creating table..");
      const createTableResponse = await oThis.ddbObject.call('createTable', oThis.createTableConfig);
      if(createTableResponse.isFailure()){
        return onResolve(createTableResponse);
      }

      const roleARN = createTableResponse.data.TableDescription.TableArn
        , tableName = createTableResponse.data.tableName
        , waitForTableExistsParams = {tableName: tableName}
      ;
      logger.debug("Table arn :", roleARN);

      logger.info("Waiting for table creation..");
      const waitFortableExistsResponse = await oThis.ddbObject.call('waitFor','tableExists', waitForTableExistsParams);
      if(waitFortableExistsResponse.isFailure()){
        return onResolve(waitFortableExistsResponse);
      }

      logger.info("Enable continuous backup..");
      const continuousBackupResponse = await oThis.ddbObject.call('updateContinuousBackups', oThis.updateContinuousBackupConfig);
      if(continuousBackupResponse.isFailure()){
        return onResolve(continuousBackupResponse);
      }

      logger.info("Register auto scaling target..");
      let registerAutoScalePromiseArray = []
        , putAutoScalePolicyArray = []
      ;
      registerAutoScalePromiseArray.push(oThis.autoScalingConfig.registerScalableTargetWrite);
      registerAutoScalePromiseArray.push(oThis.autoScalingConfig.registerScalableTargetRead);

      const registerAutoScalePromiseResponse = await Promise.all(registerAutoScalePromiseArray);
      if (registerAutoScalePromiseResponse[0].isFailure()) {
        return onResolve(registerAutoScalePromiseResponse[0]);
      }
      if (registerAutoScalePromiseResponse[1].isFailure()) {
        return onResolve(registerAutoScalePromiseResponse[1]);
      }

      logger.info("Putting auto scale policy..");
      putAutoScalePolicyArray.push(oThis.autoScalingConfig.putScalingPolicyWrite);
      putAutoScalePolicyArray.push(oThis.autoScalingConfig.putScalingPolicyRead);

      const putAutoScalePolicyPromiseResponse = await Promise.all(putAutoScalePolicyArray);
      if (putAutoScalePolicyPromiseResponse[0].isFailure()) {
        return onResolve(putAutoScalePolicyPromiseResponse[0]);
      }
      if (putAutoScalePolicyPromiseResponse[1].isFailure()) {
        return onResolve(putAutoScalePolicyPromiseResponse[1]);
      }

      const describeTableParams = {tableName: tableName}
        , describeTableResponse = await oThis.ddbObject.call('describeTable', describeTableParams)
       ;

      onResolve(describeTableResponse)
    });
  },

};

Object.assign(CreateTableMigration.prototype, CreateTableMigrationPrototype);
CreateTableMigration.prototype.constructor = CreateTableMigration;
module.exports = CreateTableMigration;
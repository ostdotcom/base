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
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , coreConstants = require(rootPrefix + "/config/core_constants")
  , LoggerKlass = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new LoggerKlass()
;

/**
 * Constructor for TableExist service class
 *
 * @params {object} ddbObject - DynamoDB Object
 * @params {object} autoScalingObject - auto scaling Object
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
const CreateTableMigration = function(ddbObject, autoScalingObject ,params) {
  const oThis = this
  ;
  oThis.autoScalingObject = autoScalingObject;
  oThis.createTableConfig = params.createTableConfig;
  //oThis.updateContinuousBackupConfig = params.updateContinuousBackupConfig;
  oThis.autoScalingConfig = params.autoScalingConfig;
  logger.debug("\nparams.createTableConfig", params.createTableConfig, "\nparams.autoScalingConfig", params.autoScalingConfig);
  //logger.debug("\nautoScalingMethods");
  //console.log(Object.getOwnPropertyNames(autoScalingObject));

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

    if (!oThis.autoScalingObject) {
      return responseHelper.paramValidationError({
        internal_error_identifier:"l_dy_ctm_validateParams_1",
        api_error_identifier: "invalid_api_params",
        params_error_identifiers: ["auto_scale_object_missing"],
        debug_options: {},
        error_config: coreConstants.ERROR_CONFIG
      });
    }

    if (!oThis.params.createTableConfig) {
      return responseHelper.paramValidationError({
        internal_error_identifier:"l_dy_ctm_validateParams_2",
        api_error_identifier: "invalid_api_params",
        params_error_identifiers: ["create_table_config_missing"],
        debug_options: {},
        error_config: coreConstants.ERROR_CONFIG
      });
    }

    // if (!oThis.params.updateContinuousBackupConfig) {
    //   return responseHelper.error('l_dy_ctm_validateParams_3', 'updateContinuousBackupConfig config is mandatory');
    // }

    if (!oThis.params.autoScalingConfig){
      return responseHelper.paramValidationError({
        internal_error_identifier:"l_dy_ctm_validateParams_4",
        api_error_identifier: "invalid_api_params",
        params_error_identifiers: ["auto_scale_config_missing"],
        debug_options: {},
        error_config: coreConstants.ERROR_CONFIG
      });
    }

    if (!oThis.params.autoScalingConfig.registerScalableTargetWrite){
      return responseHelper.paramValidationError({
        internal_error_identifier:"l_dy_ctm_validateParams_5",
        api_error_identifier: "invalid_api_params",
        params_error_identifiers: ["register_scalable_target_write_missing"],
        debug_options: {},
        error_config: coreConstants.ERROR_CONFIG
      });
    }

    if (!oThis.params.autoScalingConfig.registerScalableTargetRead){
      return responseHelper.paramValidationError({
        internal_error_identifier:"l_dy_ctm_validateParams_6",
        api_error_identifier: "invalid_api_params",
        params_error_identifiers: ["register_scalable_target_read"],
        debug_options: {},
        error_config: coreConstants.ERROR_CONFIG
      });
    }

    if (!oThis.params.autoScalingConfig.putScalingPolicyWrite){
      return responseHelper.paramValidationError({
        internal_error_identifier:"l_dy_ctm_validateParams_7",
        api_error_identifier: "invalid_api_params",
        params_error_identifiers: ["put_scaling_policy_write"],
        debug_options: {},
        error_config: coreConstants.ERROR_CONFIG
      });
    }

    if (!oThis.params.autoScalingConfig.putScalingPolicyRead){
      return responseHelper.paramValidationError({
        internal_error_identifier:"l_dy_ctm_validateParams_8",
        api_error_identifier: "invalid_api_params",
        params_error_identifiers: ["put_scaling_policy_read"],
        debug_options: {},
        error_config: coreConstants.ERROR_CONFIG
      });
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
        , tableName = oThis.createTableConfig.TableName
        , waitForTableExistsParams = {TableName: tableName}
      ;
      logger.debug("Table arn :", roleARN);

      oThis.autoScalingConfig.registerScalableTargetWrite.RoleARN = roleARN;
      oThis.autoScalingConfig.registerScalableTargetRead.RoleARN = roleARN;

      logger.info("Waiting for table creation..");
      const waitFortableExistsResponse = await oThis.ddbObject.call('waitFor','tableExists', waitForTableExistsParams);
      if(waitFortableExistsResponse.isFailure()){
        return onResolve(waitFortableExistsResponse);
      }
      logger.info(tableName + " Table created..");

      logger.info("Register auto scaling read/write target started..");
      let registerAutoScalePromiseArray = []
        , putAutoScalePolicyArray = []
      ;
      registerAutoScalePromiseArray.push(oThis.autoScalingObject.registerScalableTarget(oThis.autoScalingConfig.registerScalableTargetWrite));
      registerAutoScalePromiseArray.push(oThis.autoScalingObject.registerScalableTarget(oThis.autoScalingConfig.registerScalableTargetRead));

      const registerAutoScalePromiseResponse = await Promise.all(registerAutoScalePromiseArray);
      if (registerAutoScalePromiseResponse[0].isFailure()) {
        return onResolve(registerAutoScalePromiseResponse[0]);
      }
      if (registerAutoScalePromiseResponse[1].isFailure()) {
        return onResolve(registerAutoScalePromiseResponse[1]);
      }
      logger.info("Register auto scaling read/write target done.");

      logger.info("Putting auto scale read/write policy..");
      putAutoScalePolicyArray.push(oThis.autoScalingObject.putScalingPolicy(oThis.autoScalingConfig.putScalingPolicyWrite));
      putAutoScalePolicyArray.push(oThis.autoScalingObject.putScalingPolicy(oThis.autoScalingConfig.putScalingPolicyRead));

      const putAutoScalePolicyPromiseResponse = await Promise.all(putAutoScalePolicyArray);
      if (putAutoScalePolicyPromiseResponse[0].isFailure()) {
        return onResolve(putAutoScalePolicyPromiseResponse[0]);
      }
      if (putAutoScalePolicyPromiseResponse[1].isFailure()) {
        return onResolve(putAutoScalePolicyPromiseResponse[1]);
      }
      logger.info("Putting auto scale read/write policy done.");

      // logger.info("Enable continuous backup started..");
      // const continuousBackupResponse = await oThis.ddbObject.call('updateContinuousBackups', oThis.updateContinuousBackupConfig);
      // if(continuousBackupResponse.isFailure()){
      //   return onResolve(continuousBackupResponse);
      // }
      // logger.info("Enable continuous backup done.");

      const describeTableParams = {TableName: tableName}
        , describeTableResponse = await oThis.ddbObject.call('describeTable', describeTableParams)
       ;

      onResolve(describeTableResponse)
    });
  },

};

Object.assign(CreateTableMigration.prototype, CreateTableMigrationPrototype);
CreateTableMigration.prototype.constructor = CreateTableMigration;
module.exports = CreateTableMigration;
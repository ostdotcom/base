"use strict";

/**
 *
 * This class would be used for executing migrations for shard management register.<br><br>
 *
 * @module services/shard_management/shard_migration
 *
 */

const rootPrefix = '../../..'
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , coreConstants = require(rootPrefix + "/config/core_constants")
  , Logger = require(rootPrefix + "/lib/logger/custom_console_logger")
  , logger = new Logger()
  , managedShardConst = require(rootPrefix + "/lib/global_constant/managed_shard")
  , availableShardConst = require(rootPrefix + "/lib/global_constant/available_shard")
;

/**
 * Constructor to create object of shard migration
 *
 * @constructor
 *
 * @params {object} params
 * @params {object} params.ddb_api_object - ddb api object
 * @params {object} params.auto_scaling_api_object - auto scaling api object
 *
 * @return {Object}
 *
 */
const ShardMigration = function (params) {
  const oThis = this
  ;
  oThis.ddbApiObject = params.ddb_api_object;
  oThis.autoScalingApiObject = params.auto_scaling_api_object;
};

ShardMigration.prototype = {

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
      let r = null;
      r = oThis.validateParams();
      logger.debug("ShardMigration.executeShardMigration.validateParams", r);
      if (r.isFailure()) return r;

      r = await oThis.executeShardMigration();
      logger.debug("ShardMigration.executeShardMigration.executeShardMigration", r);
      return r;
    } catch (err) {
      return responseHelper.error({
        internal_error_identifier:"s_sm_sm_perform_1",
        api_error_identifier: "exception",
        debug_options: {error: err},
        error_config: coreConstants.ERROR_CONFIG
      });
    }

  },

  /**
   * Validation of params
   *
   * @return {Promise<any>}
   *
   */
  validateParams: function () {
    const oThis = this
    ;

    if (!oThis.ddbApiObject) {
      return responseHelper.paramValidationError({
        internal_error_identifier: "d_sm_sm_validateParams_1",
        api_error_identifier: "invalid_api_params",
        params_error_identifiers: ["ddb_object_missing"],
        debug_options: {},
        error_config: coreConstants.ERROR_CONFIG
      });
    }

    if (!oThis.autoScalingApiObject) {
      return responseHelper.paramValidationError({
        internal_error_identifier: "d_sm_sm_validateParams_2",
        api_error_identifier: "invalid_api_params",
        params_error_identifiers: ["auto_scale_object_missing"],
        debug_options: {},
        error_config: coreConstants.ERROR_CONFIG
      });
    }

    return responseHelper.successWithData({});
  },

  /**
   * Execute the shard migration
   *
   * @return {Promise<any>}
   *
   */
  executeShardMigration: function () {
    const oThis = this
    ;

    return new Promise(async function (onResolve) {
      try {
        var r = null;

        r = await oThis.runAvailableShardMigration();
        if (r.isFailure()) return r;

        r = await oThis.runManagedShardMigration();
        return r;

      } catch (err) {
        return responseHelper.error({
          internal_error_identifier:"s_am_r_runRegister_1",
          api_error_identifier: "exception",
          debug_options: {error: err},
          error_config: coreConstants.ERROR_CONFIG
        });
      }
    });

  },

  /**
   * Run CreateAvailableShardMigration
   *
   * @return {Promise<void>}
   *
   */
  runAvailableShardMigration: async function () {
    const oThis = this
    ;

    logger.debug("========ShardMigration.runAvailableShardMigration Started=======");

    let params = {};
    params.createTableConfig = oThis.getAvailableShardsCreateTableParams();
    const tableName = params.createTableConfig.TableName
      , resourceId = 'table/' + tableName
      , arn = "ARN"
    ;
    params.autoScalingConfig = oThis.getAvailableShardsAutoScalingParams(tableName, arn, resourceId);
    const availableShardsResponse = await oThis.ddbApiObject.createTableMigration(oThis.autoScalingApiObject, params);

    logger.debug(availableShardsResponse);
    if (availableShardsResponse.isFailure()) {
      logger.error("Failure error ", availableShardsResponse.err.msg);
    }
    logger.debug("========ShardMigration.runAvailableShardMigration Ended=======");
    return availableShardsResponse;
  },

  /**
   * Run CreateManagedShardMigration
   *
   * @return {Promise<void>}
   */
  runManagedShardMigration: async function () {
    const oThis = this
    ;

    logger.debug("========ShardMigration.runManagedShardMigration Started=======");

    let params = {};
    params.createTableConfig = await oThis.getManagedShardsCreateTableParams();
    const tableName = params.createTableConfig.TableName
      , resourceId = 'table/' + tableName
      , arn = "ARN"
    ;
    params.autoScalingConfig = await oThis.getManagedShardsAutoScalingParams(tableName, arn, resourceId);

    const managedShardsResponse = await oThis.ddbApiObject.createTableMigration(oThis.autoScalingApiObject, params);
    logger.debug(managedShardsResponse);
    if (managedShardsResponse.isFailure()) {
      logger.error("Is Failure having err ", managedShardsResponse.err.msg);
    }
    logger.debug("========ShardMigration.runManagedShardMigration Ended=======");
    return managedShardsResponse;
  },

  /**
   * get create table params for AvailableShards table
   *
   * @return {Object}
   */
  getAvailableShardsCreateTableParams: function() {
    return {
        TableName: availableShardConst.getTableName(),
          AttributeDefinitions: [
        {
          AttributeName: availableShardConst.SHARD_NAME,
          AttributeType: "S"
        },
        {
          AttributeName: availableShardConst.ENTITY_TYPE,
          AttributeType: "S"
        },
        {
          AttributeName: availableShardConst.ALLOCATION_TYPE,
          AttributeType: "N"
        }
      ],
        KeySchema: [
        {
          AttributeName: availableShardConst.SHARD_NAME,
          KeyType: "HASH"
        }
      ],
        GlobalSecondaryIndexes: [{
        IndexName: availableShardConst.getIndexNameByEntityAllocationType(),
        KeySchema: [
          {
            AttributeName: availableShardConst.ENTITY_TYPE,
            KeyType: 'HASH'
          },
          {
            AttributeName: availableShardConst.ALLOCATION_TYPE,
            KeyType: 'RANGE'
          }
        ],
        Projection: {
          ProjectionType: 'KEYS_ONLY'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        }
      }],
        ProvisionedThroughput: {
        ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
      }
    }

  },

  /**
   * get auto scaling params for AvailableShards table
   *
   * @return {Object}
   */
  getAvailableShardsAutoScalingParams: function(tableName, roleArn, resourceId){
    let autoScalingConfig = {};

    autoScalingConfig.registerScalableTargetWrite = {
      ResourceId: resourceId, /* required */
      ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
      ServiceNamespace: 'dynamodb' , /* required */
      MaxCapacity: 50,
      MinCapacity: 1,
      RoleARN: roleArn

    };

    autoScalingConfig.registerScalableTargetRead = {
      ResourceId: resourceId, /* required */
      ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
      ServiceNamespace: 'dynamodb' , /* required */
      MaxCapacity: 50,
      MinCapacity: 1,
      RoleARN: roleArn

    };

    autoScalingConfig.putScalingPolicyWrite  = {
      ServiceNamespace: "dynamodb",
      ResourceId: resourceId,
      ScalableDimension: "dynamodb:table:WriteCapacityUnits",
      PolicyName: tableName + "-scaling-policy",
      PolicyType: "TargetTrackingScaling",
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: {
          PredefinedMetricType: "DynamoDBWriteCapacityUtilization"
        },
        ScaleOutCooldown: 5, // seconds
        ScaleInCooldown: 5, // seconds
        TargetValue: 70.0
      }
    };

    autoScalingConfig.putScalingPolicyRead  = {
      ServiceNamespace: "dynamodb",
      ResourceId: resourceId,
      ScalableDimension: "dynamodb:table:ReadCapacityUnits",
      PolicyName: tableName + "-scaling-policy",
      PolicyType: "TargetTrackingScaling",
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: {
          PredefinedMetricType: "DynamoDBReadCapacityUtilization"
        },
        ScaleOutCooldown: 5, // seconds
        ScaleInCooldown: 5, // seconds
        TargetValue: 70.0
      }
    };

    return autoScalingConfig;
  },

  /**
   * get create table params for ManagedShards table
   *
   * @return {Object}
   */
  getManagedShardsCreateTableParams: function() {
    return {
      TableName: managedShardConst.getTableName(),
      AttributeDefinitions: [
        {
          AttributeName: managedShardConst.IDENTIFIER,
          AttributeType: "S"
        },
        {
          AttributeName: managedShardConst.ENTITY_TYPE,
          AttributeType: "S"
        }
      ],
      KeySchema: [
        {
          AttributeName: managedShardConst.IDENTIFIER,
          KeyType: "HASH"
        },
        {
          AttributeName: managedShardConst.ENTITY_TYPE,
          KeyType: "RANGE"
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    }
  },

  /**
   * get auto scaling params for ManagedShards table
   *
   * @return {Object}
   */
  getManagedShardsAutoScalingParams: function(tableName, roleArn, resourceId){
    let autoScalingConfig = {};

    autoScalingConfig.registerScalableTargetWrite = {
      ResourceId: resourceId, /* required */
      ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
      ServiceNamespace: 'dynamodb' , /* required */
      MaxCapacity: 50,
      MinCapacity: 1,
      RoleARN: roleArn

    };

    autoScalingConfig.registerScalableTargetRead = {
      ResourceId: resourceId, /* required */
      ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
      ServiceNamespace: 'dynamodb' , /* required */
      MaxCapacity: 50,
      MinCapacity: 1,
      RoleARN: roleArn

    };

    autoScalingConfig.putScalingPolicyWrite  = {
      ServiceNamespace: "dynamodb",
      ResourceId: resourceId,
      ScalableDimension: "dynamodb:table:WriteCapacityUnits",
      PolicyName: tableName + "-scaling-policy",
      PolicyType: "TargetTrackingScaling",
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: {
          PredefinedMetricType: "DynamoDBWriteCapacityUtilization"
        },
        ScaleOutCooldown: 5, // seconds
        ScaleInCooldown: 5, // seconds
        TargetValue: 70.0
      }
    };

    autoScalingConfig.putScalingPolicyRead  = {
      ServiceNamespace: "dynamodb",
      ResourceId: resourceId,
      ScalableDimension: "dynamodb:table:ReadCapacityUnits",
      PolicyName: tableName + "-scaling-policy",
      PolicyType: "TargetTrackingScaling",
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: {
          PredefinedMetricType: "DynamoDBReadCapacityUtilization"
        },
        ScaleOutCooldown: 5, // seconds
        ScaleInCooldown: 5, // seconds
        TargetValue: 70.0
      }
    };

    return autoScalingConfig;
  }

};

module.exports = ShardMigration;

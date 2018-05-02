"use strict";

/**
 * Shard service api
 *
 * @module services/dynamodb/shard_management/shard_api
 *
 */

const rootPrefix  = "../../.."
  , ShardMigrationKlass  = require(rootPrefix + '/services/dynamodb/shard_management/shard_migration')
  , AddShardKlass = require(rootPrefix + '/services/dynamodb/shard_management/available_shard/add_shard')
  , ConfigureShardKlass = require(rootPrefix + '/services/dynamodb/shard_management/available_shard/configure_shard')
  , AssignShardKlass = require(rootPrefix + '/services/dynamodb/shard_management/managed_shard/assign_shard')
  , GetShardKlass = require(rootPrefix + '/services/dynamodb/shard_management/managed_shard/get_shard')
  , GetShardsByTypeKlass = require(rootPrefix + '/services/dynamodb/shard_management/available_shard/get_shards')
;

/**
 * Constructor for Shard Service api class
 *
 * @params {Object} params - DynamoDb object connection
 *
 * @constructor
 */
const ShardServiceApi = function(params) {
  const oThis = this
  ;

  oThis.params = params;

};

ShardServiceApi.prototype = {

  /**
   * To run Shard Migration
   * @return {*|promise<result>}
   */
  runShardMigration: function() {
    const oThis = this
    ;

    return new ShardMigrationKlass(oThis.params).perform();
  },

  /**
   *  To add Shard
   * @param params
   * @return {*|promise<result>}
   */
  addShard: function(params) {
    const oThis = this
      , addShardParams = Object.assign(params, oThis.params)
    ;

    return new AddShardKlass(addShardParams).perform();
  },

  /**
   * To configure shard
   * @param params
   * @return {*|promise<result>}
   */
  configureShard: function(params) {
    const oThis = this
      , configureShardParams = Object.assign(params, oThis.params)
    ;

    return new ConfigureShardKlass(configureShardParams).perform();
  },

  /**
   * get Shards by type
   * @param params
   * @return {*|promise<result>}
   */
  getShardsByType: function (params) {
    const oThis = this
      , configureShardParams = Object.assign(params, oThis.params)
    ;

    return new GetShardsByTypeKlass(configureShardParams).perform();
  },

  /**
   * To assign shqard
   * @param params
   * @return {*|promise<result>}
   */
  assignShard: function (params) {
    const oThis = this
      , assignShardParams = Object.assign(params, oThis.params)
    ;

    return new AssignShardKlass(assignShardParams).perform();
  },

  /**
   * get shard
   * @param params
   */
  getShard: function (params) {
    const oThis = this
      , getShardParams = Object.assign(params, oThis.params)
    ;

    return new GetShardKlass(getShardParams).perform();
  }
};

module.exports = ShardServiceApi;

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
  , GetShardNameKlass = require(rootPrefix + '/services/dynamodb/shard_management/managed_shard/get_shard_name')
  , GetShardListKlass = require(rootPrefix + '/services/dynamodb/shard_management/available_shard/get_shard_list')
  , HasShardKlass = require(rootPrefix + '/services/dynamodb/shard_management/available_shard/has_shard')
;

/**
 * Constructor for Shard Service api class
 *
 * @params {Object} ddbObject - DynamoDb object connection
 *
 * @constructor
 */
const ShardServiceApi = function(ddbObject) {
  const oThis = this
  ;

  oThis.ddbObject = ddbObject;

};

ShardServiceApi.prototype = {

  /**
   * To run Shard Migration
   * @return {*|promise<result>}
   */
  runShardMigration: function() {
    const oThis = this
    ;

    return new ShardMigrationKlass({ddb_object: oThis.ddbObject}).perform();
  },

  /**
   *  To add Shard
   * @param params
   * @return {*|promise<result>}
   */
  addShard: function(params) {
    const oThis = this
      , addShardParams = Object.assign({ddb_object: oThis.ddbObject}, params)
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
      , configureShardParams = Object.assign({ddb_object: oThis.ddbObject}, params)
    ;

    return new ConfigureShardKlass(configureShardParams).perform();
  },

  /**
   * get Shard list by type
   * @param params
   * @return {*|promise<result>}
   */
  getShardsByType: function (params) {
    const oThis = this
      , configureShardParams = Object.assign({ddb_object: oThis.ddbObject}, params)
    ;

    return new GetShardListKlass(configureShardParams).perform();
  },

  /**
   * To assign shard
   * @param params
   * @return {*|promise<result>}
   */
  assignShard: function (params) {
    const oThis = this
      , assignShardParams = Object.assign({ddb_object: oThis.ddbObject}, params)
    ;

    return new AssignShardKlass(assignShardParams).perform();
  },

  /**
   * has shard
   * @param params
   */
  hasShard: function (params) {
    const oThis = this
      , hasShardParams = Object.assign({ddb_object: oThis.ddbObject}, params)
    ;

    return new HasShardKlass(hasShardParams).perform();
  },

  /**
   * get shard
   * @param params
   */
  getShard: function (params) {
    const oThis = this
      , getShardParams = Object.assign({ddb_object: oThis.ddbObject}, params)
    ;

    return new GetShardNameKlass(getShardParams).perform();
  }
};

module.exports = ShardServiceApi;

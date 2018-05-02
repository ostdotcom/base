"use strict";

/**
 * Managed Shard Model
 *
 * @module lib/models/dynamodb/managed_shard
 *
 */

const rootPrefix = '../../..'
  , ResponseHelper = require(rootPrefix + '/lib/formatter/response')
  , moduleName = 'lib/models/dynamodb/managed_shard'
  , responseHelper = new ResponseHelper({module_name: moduleName})
  , Logger            = require( rootPrefix + "/lib/logger/custom_console_logger")
  , logger            = new Logger()
  , basicHelper = require(rootPrefix+'/helpers/basic')
;

/**
 * Constructor Managed Shard Model
 *
 * @constructor
 */
const ManagedShard = function() {};

ManagedShard.prototype = {

  getItem: function(ddbItem) {
    return new Item(ddbItem);
  },

  // For representation purpose
  columnNameMapping: function(){
    return {
      'id':'identifier',
      'et':'entity_type',
      'sn':'shard_name',
      'c': 'created_at',
      'u': 'updated_at'
    }
  },

  invertedColumnNameMapping: function(){
    const oThis = this
    ;
    return basicHelper.reverseObject(oThis.columnNameMapping);
  },

};

const Item = function(ddbItem) {
  const oThis = this
  ;
  oThis.ddbItem = ddbItem;
};

Item.prototype = {

  identifier: function() {
    const oThis = this
    ;
    return oThis.ddbItem.id;
  },

  entityType: function() {
    const oThis = this
    ;
    return oThis.ddbItem.et;
  },

  shardNumber: function() {
    const oThis = this
    ;
    return oThis.ddbItem.sn;
  },

  createdAt: function() {
    const oThis = this
    ;
    return oThis.ddbItem.c;
  },

  updatedAt: function() {
    const oThis = this
    ;
    return oThis.ddbItem.u;
  },

  /**
   * Run get shard
   *
   * @param {string} params.identifier - identifier
   * @param {string} params.entity_type - entity type
   *
   * @return {Promise<any>}
   *
   */
  getShard: function (params) {
    const oThis = this
      , identifier = params.identifier
      , entityType = params.entity_type
    ;

    return new Promise(async function (onResolve) {
      try {
        // Todo:: Get shard based on params
        return onResolve(responseHelper.successWithData({}));
      } catch (err) {
        return onResolve(responseHelper.error('s_sm_as_gs_getShard_1', 'Error getting shard. ' + err));
      }
    });
  },

  assignShard: function () {
    const oThis = this
    ;

    return new Promise(async function (onResolve) {
      try {
        // Todo:: Assign shard based on params
        return onResolve(responseHelper.successWithData({}));
      } catch (err) {
        return onResolve(responseHelper.error('s_sm_as_as_assignShard_1', 'Error assigning shard. ' + err));
      }
    });
  }
};

module.exports = new ManagedShard();
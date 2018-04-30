"use strict";

/**
 * Managed Shard Model
 *
 * @module models/dynamodb/managed_shard
 *
 */

/**
 * Constructor Managed Shard Model
 *
 * @constructor
 */
const ManagedShard = function() {};

ManagedShard.prototype = {

  getItem: function(ddbItem) {
    return new Item(ddbItem);
  }

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
  }

};

module.exports = ManagedShard;
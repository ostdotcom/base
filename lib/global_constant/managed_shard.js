"use strict";

const rootPrefix  = "../.."
  , utils = require(rootPrefix + '/lib/utils')

;

/**
 * Constructor for managed shard globalConstant class
 *
 * @constructor
 */
const managedShard = function() {};

managedShard.prototype = {

  getTableName: function () {
    return 'ManagedShard';
  },

  // COLUMN Keys
  IDENTIFIER: 'ID',
  ENTITY_TYPE: 'ET',
  SHARD_NAME: 'SN',
  CREATED_AT: "C",
  UPDATED_AT: "U",

  getSupportedEntityTypes: function () {
    return {
      transactionLogs: 'tl',
      userBalances: 'ub'
    }
  },

  getSupportedInverseEntityTypes: function () {
    return utils.invert(this.getSupportedEntityTypes())
  },

};

module.exports = new managedShard();
"use strict";

const rootPrefix  = "../.."
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

  getSupportedEntityTypes: function () {
    return {
      transactionLogs: 'tl',
      userBalances: 'ub'
    }
  },

  // All Entity Types
  transactionLogs: function () {
    return 'tl';
  },

  userBalances: function(){
    return 'ub';
  },

  IDENTIFIER: 'ID',
  ENTITY_TYPE: 'ET',
  SHARD_NAME: 'SN',
  CREATED_AT: "C",
  UPDATED_AT: "U"
};

module.exports = new managedShard();
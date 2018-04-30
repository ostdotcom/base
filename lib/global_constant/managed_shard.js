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
  }
};

module.exports = new managedShard();
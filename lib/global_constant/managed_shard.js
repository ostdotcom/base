"use strict";

const rootPrefix  = "../.."
  , basicHelper = require(rootPrefix+'/helpers/basic')
;

/**
 * Constructor for managed shard globalconstant class
 *
 * @constructor
 */
const managedShard = function() {};

managedShard.prototype = {

  columnNameMapping: function(){
    return {
      'id':'identifier',
      'et':'entity_type',
      'sn':'shard_number',
      'c': 'created_at',
      'u': 'updated_at'
    }
  },

  invertedColumnNameMapping: function(){
    const oThis = this
    ;
    return basicHelper.reverseObject(oThis.columnNameMapping);
  },

  // All Entity Types
  transactionLogs: function(){
    return 'tl';
  },

  userBalances: function(){
    return 'ub';
  },

};

module.exports = new managedShard();
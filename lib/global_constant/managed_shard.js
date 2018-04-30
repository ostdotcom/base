"use strict";

const managedShard = {

  // All Entity Types
  transactionLogs: function(){
    return 'tl';
  },

  userBalances: function(){
    return 'ub';
  }

};

module.exports = managedShard;
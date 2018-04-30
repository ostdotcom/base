"use strict";

const managedShard = {

  transactionLogs: function(){
    return 'tl';
  },

  userBalances: function(){
    return 'ub';
  }

};

module.exports = managedShard;